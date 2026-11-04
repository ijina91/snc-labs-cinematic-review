import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

// Local preparation only. Review candidates never publish themselves.
const root = path.resolve('artifacts/frame-redesign-v2');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'production.json'), 'utf8'));
const pairs = [['01','02'],['02','03'],['03','04'],['04','05'],['05','06'],['06','07'],['07','07']];
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const run = args => {
  const result = spawnSync(ffmpeg, ['-hide_banner','-loglevel','error',...args], {encoding:'utf8',timeout:240000});
  if (result.error || result.status !== 0) throw Error(result.error?.message || result.stderr);
  return result;
};
const verifyFrames = (file, expected) => {
  const result=run(['-threads','1','-i',file,'-map','0:v:0','-progress','pipe:1','-nostats','-f','null','-']);
  const counts=[...result.stdout.matchAll(/^frame=(\d+)\s*$/gm)];
  if (Number(counts.at(-1)?.[1]) !== expected) throw Error(`Unexpected decoded frame count for ${path.basename(file)}: expected ${expected}.`);
};
if (manifest.version !== 2 || /REJECTED/.test(manifest.state)) throw Error('Only the current accepted v2 source set may be prepared.');
const inputs = pairs.map(([from,to],i) => {
  const record = manifest.segments[i];
  if (!record || record.from !== from || record.to !== to || record.state !== 'GENERATED_DOWNLOADED_REVIEWED' || !record.full_decode || !record.job_id) {
    throw Error(`Missing generation, decode or visual acceptance for ${from}-${to}.`);
  }
  const file=path.join(root,'originals',`${from}-${to}.mp4`);
  if (!fs.existsSync(file) || hash(file) !== record.sha256) throw Error(`Original hash mismatch: ${from}-${to}`);
  if (!Number.isFinite(record.out_seconds) || record.out_seconds <= (record.in_seconds || 0)) throw Error(`Reviewed edit points required for ${from}-${to}.`);
  if (i > 0 && record.start_frame !== manifest.segments[i-1].next_start_frame) throw Error(`The ${from} handoff must use the preceding actual decoded frame.`);
  return {file,record};
});
const output=path.join(root,'candidates'); fs.mkdirSync(output,{recursive:true});
const normalized=inputs.map(({file,record},i) => {
  const start=record.in_seconds || 0, length=record.out_seconds-start;
  const target=path.join(output,`${pairs[i].join('-')}.mp4`);
  run(['-threads','1','-ss',String(start),'-i',file,'-an','-map_metadata','-1',
    // fps needs an EOF tail to emit the final sampled frame. The 120-frame
    // limit discards the tail while retaining an exact five-second interval.
    '-vf',`trim=duration=${length},setpts=${5/length}*(PTS-STARTPTS),tpad=stop_mode=clone:stop=24,scale=1280:704:flags=lanczos,setsar=1,fps=24,format=yuv420p`,
    '-frames:v','120','-c:v','libx264','-preset','fast','-crf','18','-threads','2','-g','6','-sc_threshold','0','-movflags','+faststart','-y',target]);
  verifyFrames(target,120); return target;
});
const master=path.join(output,'snc-blue-glass-v2.mp4');
// True adjacent-frame joins. No crossfade that could conceal unrelated shots.
run(['-filter_complex_threads','1',...normalized.flatMap(file=>['-threads','1','-i',file]),
  '-filter_complex',`${normalized.map((_,i)=>`[${i}:v]`).join('')}concat=n=7:v=1:a=0[v]`,
  '-map','[v]','-an','-map_metadata','-1','-c:v','libx264','-preset','fast','-crf','21','-threads','2','-g','6','-sc_threshold','0','-movflags','+faststart','-y',master]);
const phone=path.join(output,'snc-blue-glass-v2-mobile.mp4');
run(['-threads','1','-i',master,'-an','-map_metadata','-1','-vf','scale=800:440:flags=lanczos','-c:v','libx264','-preset','fast','-crf','22','-threads','2','-g','6','-sc_threshold','0','-movflags','+faststart','-y',phone]);
for (const file of [master,phone]) verifyFrames(file,840);
fs.writeFileSync(path.join(output,'review.json'),JSON.stringify({
  state:'ENCODED_DECODED_REQUIRES_FINAL_PLAYBACK_AND_JOIN_REVIEW',
  seconds:35,fps:24,cue_seconds:[0,5,10,15,20,25,30],
  files:[master,phone].map(file=>({file:path.basename(file),bytes:fs.statSync(file).size,sha256:hash(file)})),
  publish_automatically:false
},null,2));
console.log('Candidate encodes and full decode complete. Website adoption remains a separate visual review step.');
