use actix_cors::Cors;
use actix_web::{body, get, http, post, web, App, HttpRequest, HttpResponse, HttpServer, Result};

use actix_files as fs;
use std::sync::Mutex;

mod ffmpeg;
mod lib;
mod spider;
mod synthesis;
pub mod util;

use ffmpeg::video::{
    combine_audio, combine_video, convert_video_to_audio, convert_video_to_other_format,
    crop_video, query_video_info, remove_audio_from_video, speed_up_video, trim_video,
    video_combine_subtitle,
};

use ffmpeg::audio::{
    convert_audio_to_other_format, crop_audio, query_audio_info, silent_partial_audio,
};

use synthesis::audio::{convert_srt_to_audio, convert_txt_to_audio};

use actix_files::NamedFile;
use spider::audio::audio_square_search;
use std::path::PathBuf;

struct AppState {
    count: Mutex<i32>,
}

#[get("/auto_add")]
async fn auto_add(data: web::Data<AppState>) -> String {
    let mut count = data.count.lock().unwrap();
    *count += 1;
    format!("Count: {}", *count)
}

#[get("/{filename:.*}")]
async fn get_local_file(req: HttpRequest) -> Result<NamedFile> {
    let path: PathBuf = req.match_info().query("filename").parse().unwrap();
    Ok(NamedFile::open_async(path).await?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(AppState {
                count: Mutex::new(0),
            }))
            .service(get_local_file)
            .service(auto_add)
            .service(audio_square_search)
            .service(query_video_info)
            .service(convert_video_to_other_format)
            .service(convert_video_to_audio)
            .service(remove_audio_from_video)
            .service(convert_audio_to_other_format)
            .service(query_audio_info)
            .service(combine_audio)
            .service(crop_video)
            .service(trim_video)
            .service(combine_video)
            .service(speed_up_video)
            .service(silent_partial_audio)
            .service(crop_audio)
            .service(video_combine_subtitle)
            .service(convert_txt_to_audio)
            .service(convert_txt_to_audio)
    })
    .bind(("127.0.0.1", 8088))?
    .run()
    .await
}
