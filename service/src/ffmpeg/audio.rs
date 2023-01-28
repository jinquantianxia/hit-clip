use crate::ffmpeg::objects::{CommonConvertObject, QueryFileInfo};
use actix_web::rt::spawn;
use actix_web::{get, post, web, Responder, Result};
use std::env::current_dir;
use std::process::Command;

#[post("/audio/info")]
pub async fn query_audio_info(req: web::Json<QueryFileInfo>) -> Result<impl Responder> {
    let QueryFileInfo = req.into_inner();
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args(["-i", &QueryFileInfo.local_path, "-hide_banner"])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

#[post("/audio/convert_to_other_format")]
pub async fn convert_audio_to_other_format(
    req: web::Json<CommonConvertObject>,
) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args(["-i", &query_obj.input, &query_obj.output])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg -i D:\test.m4a -af "volume=enable='between(t,0,10)':volume=0" D:\test_silent.m4a
#[post("/audio/silent_parial")]
pub async fn silent_partial_audio(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    let rates: Vec<&str> = query_obj.extra.split(",").collect();
    let start = rates.get(0).unwrap();
    let end = rates.get(1).unwrap();
    let param = format!("volume=enable='between(t,{},{})':volume=0", start, end);
    let output = spawn(async move {
        Command::new("./ffmpeg.exe")
            .args(["-i", &query_obj.input, "-af", &param, &query_obj.output])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

// ffmpeg -i D:\test.m4a -ss 0 -to 5 D:\test_crop.m4a
#[post("/audio/crop")]
pub async fn crop_audio(req: web::Json<CommonConvertObject>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    let output = spawn(async move {
        let rates: Vec<&str> = query_obj.extra.split(",").collect();
        let start = rates.get(0).unwrap();
        let end = rates.get(1).unwrap();
        Command::new("./ffmpeg.exe")
            .args([
                "-i",
                &query_obj.input,
                "-ss",
                start,
                "-to",
                end,
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
