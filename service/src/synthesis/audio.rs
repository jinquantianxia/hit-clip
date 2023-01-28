use crate::synthesis::objects::CommonSynthsisObject;
use actix_web::rt::spawn;
use actix_web::{get, post, web, Responder, Result};
use std::env::current_dir;
use std::process::Command;

/**
 * * IBM Watson TTS *
Arabic, male: ar-AR (Omar)
Chinese (Simplified), female/male: zh-CN (Li Na-female, Wang Wei-male, Zhang Jing-female)
Dutch, female/male: nl-NL (Emma, Liam)
English (Australia), female/male: en-AU (Craig, Madison)
English (Great Britain), female/male: en-GB (Charlotte-femal, James-male, Kate-female)
English (United States), female/male: en-US (Allison-female, Emily-female, Henry-male, Kevin-male, Lisa-female, Michael-male, Olivia-female)
French, female/male: fr-FR (Nicolas, Renee)
German, female/male: de-DE (Birgit, Dieter, Erika)
Italian, female: it-IT (Francesca)
Japanese, female: ja-JP (Emi)
Korean, female/male: ko-KR (Hyunjun, SiWoo, Youngmi, Yuna)
Portuguese (Brazil), female: pt-BR (Isabela)
Spanish (European), female/male: es-ES (Enrique, Laura)
Spanish (Latin American), female: es-LA (Sofia)
Spanish (North American), female: es-US (Sofia)
 */

//  -f d:\test.srt -w d:\test_test.wav -s i -l zh-CN -g male
#[post("/synthesis/txt_to_audio")]
pub async fn convert_txt_to_audio(req: web::Json<CommonSynthsisObject>) -> Result<impl Responder> {
    let convert_info = req.into_inner();
    let output = spawn(async move {
        Command::new("./synthesis/main.exe")
            .args([
                "-f",
                &convert_info.input_file_name,
                "-w",
                &convert_info.output_file_name,
                "-s",
                &convert_info.service_name,
                "-l",
                &convert_info.language_name,
                "-g",
                &convert_info.gender,
                "-n",
                &convert_info.voice_name,
                "-r",
                &convert_info.speech_rate,
                "-v",
                &convert_info.volume,
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}

#[post("/synthesis/srt_to_audio")]
pub async fn convert_srt_to_audio(req: web::Json<CommonSynthsisObject>) -> Result<impl Responder> {
    let convert_info = req.into_inner();
    let output = spawn(async move {
        Command::new("./synthesis/main.exe")
            .args([
                "-f",
                &convert_info.input_file_name,
                "-w",
                &convert_info.output_file_name,
                "-s",
                &convert_info.service_name,
                "-l",
                &convert_info.language_name,
                "-g",
                &convert_info.gender,
                "-n",
                &convert_info.voice_name,
                "-r",
                &convert_info.speech_rate,
                "-v",
                &convert_info.volume,
                "-sub",
            ])
            .output()
            .expect("failed to execute process")
    })
    .await
    .unwrap();
    let output_str = String::from_utf8_lossy(&output.stderr);
    Ok(String::from(output_str))
}
