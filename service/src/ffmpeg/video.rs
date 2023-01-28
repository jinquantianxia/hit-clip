use crate::ffmpeg::objects::{CommonConvertObject, QueryFileInfo, VideoTrim};
use crate::util::file::check_file_and_remove;
use actix_web::rt::spawn;
use actix_web::{get, post, web, Responder, Result};
use std::env::current_dir;
use std::fs;
use std::fs::File;
use std::io::prelude::*;

use std::process::Command;

#[post("/video/info")]
pub async fn query_video_info(req: web::Json<QueryFileInfo>) -> Result<impl Responder> {
    let query_file_info = req.into_inner();
    let file_metadata = fs::metadata(&query_file_info.local_path).unwrap();
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args(["-i", &query_file_info.local_path, "-hide_banner"])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    let ret_str = format!("file_size: {} \r\n {}", file_metadata.len(), output_str);
    println!("{}", ret_str);
    Ok(ret_str)
}

#[post("/video/convert_to_audio")]
pub async fn convert_video_to_audio(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args(["-i", &query_obj.input, "-vn", &query_obj.output])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

#[post("/video/convert_to_other_format")]
pub async fn convert_video_to_other_format(
    req: web::Json<CommonConvertObject>,
) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-vf",
                &query_obj.extra,
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg -i D:\demo_combine_test.mkv -c:v copy -c:a copy D:\demo_combine_test.mp4
#[post("/video/mkv_to_mp4")]
pub async fn video_convert_mkv_to_mp4(
    req: web::Json<CommonConvertObject>,
) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    check_file_and_remove(&query_obj.output)?;
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-c:v",
                "copy",
                "-c:a",
                "copy",
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

#[post("/video/remove_audio")]
pub async fn remove_audio_from_video(
    req: web::Json<CommonConvertObject>,
) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args(["-i", &query_obj.input, "-an", &query_obj.output])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg -i audio.mp3 -i video.mp4 video_audio_mix.mkv
#[post("/video/combine_audio")]
pub async fn combine_audio(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.extra,
                "-i",
                &query_obj.input,
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg.exe -i D:\test.mp4 -ss 00:00:13 -to 00:00:16 -c:v libx264 -c:a copy D:\test_crop_finish.mp4
#[post("/video/trim")]
pub async fn trim_video(req: web::Json<VideoTrim>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-ss",
                &query_obj.start,
                "-to",
                &query_obj.end,
                "-c:v",
                "libx264",
                "-c:a",
                "copy",
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg -i D:\test_crop.mp4 -vf "crop=178:142:201:12" D:\test_crop_finish.mp4
#[post("/video/crop")]
pub async fn crop_video(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    // check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-vf",
                &query_obj.extra,
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg -f concat -i list.txt -c copy outfile.mp4
#[post("/video/combine")]
pub async fn combine_video(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    // println!(
    //     "{},{},{}",
    //     query_obj.input, query_obj.output, query_obj.extra
    // );
    check_file_and_remove(&query_obj.output);
    let mut input_str = query_obj.input;
    let paths = input_str.split(",");
    let mut output_str = String::from("");
    for path in paths {
        let tmp_str = format!("file '{}'\n", path);
        output_str.push_str(&tmp_str);
    }
    let filename = "video_list.txt";
    let mut file = File::create(filename)?;
    file.write_all(output_str.as_bytes())?;

    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                filename,
                "-c",
                "copy",
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    println!("{}", output_str);
    fs::remove_file(filename)?;
    Ok(String::from(output_str))
}

// ffmpeg -i D:\test.mp4 -filter_complex "[0:v]setpts=0.2*PTS[v];[0:a]atempo=5.0[a]" -map "[v]" -map "[a]" D:\test_speed.mp4
#[post("/video/speed_up")]
pub async fn speed_up_video(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    // println!(
    //     "{},{},{}",
    //     query_obj.input, query_obj.output, query_obj.extra
    // );
    check_file_and_remove(&query_obj.output);
    let rates: Vec<&str> = query_obj.extra.split(",").collect();
    let video_rate = rates.get(0).unwrap();
    let audio_rate = rates.get(1).unwrap();
    let str = format!(
        "[0:v]setpts={}*PTS[v];[0:a]atempo={}[a]",
        video_rate, audio_rate
    );
    // println!("{}", str);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-filter_complex",
                &str,
                "-map",
                "[v]",
                "-map",
                "[a]",
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    // let ret_str = String::from(output_str);
    // println!("{}", ret_str);
    Ok(String::from(output_str))
}

// ffmpeg  -i D:\教学.mp4 -i D:\教学.srt -map 0 -map 1 -c copy -c:v libx264 -crf 23 -preset veryfast D:\教学.mkv
#[post("/video/combine_subtitle")]
pub async fn video_combine_subtitle(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    // check_file_and_remove(&query_obj.output);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-i",
                &query_obj.extra,
                "-map",
                "0",
                "-map",
                "1",
                "-c",
                "copy",
                "-c:v",
                "libx264",
                "-crf",
                "23",
                "-preset",
                "veryfast",
                &query_obj.output,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}
