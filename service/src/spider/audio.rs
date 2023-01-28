use crate::spider::objects::{AudioItemInfo, AudioSquraeSearch};

use actix_web::{get, post, web, Responder, Result};
use reqwest;
use scraper::{Html, Selector};
use serde::Serialize;
use substring::Substring;

#[post("/audio/square_search")]
pub async fn audio_square_search(req: web::Json<AudioSquraeSearch>) -> Result<impl Responder> {
    let query_obj = req.into_inner();
    let url = query_obj.url;
    let resp = reqwest::get(url).await;
    let body = resp.unwrap().text().await.unwrap();
    let doc = Html::parse_fragment(&body);
    let audio_item_selector = Selector::parse("div.SoundContent").unwrap();
    let name_selector = Selector::parse("div.SoundTitle").unwrap();
    let name_a_selector = Selector::parse("a").unwrap();
    let player_selector = Selector::parse("div.SoundPlayer").unwrap();
    let mut ret_str = String::from("");
    let mut ret_arr: Vec<AudioItemInfo> = vec![];
    for el in doc.select(&audio_item_selector) {
        // println!("p:{}", el.inner_html());
        let name_doc = el.select(&name_selector);
        let mut name = String::from("");
        for name_el in name_doc {
            let name_a = name_el.select(&name_a_selector);
            for a in name_a {
                name = a.inner_html();
            }
        }
        let player_doc = el.select(&player_selector);
        let mut url_str = String::from("");
        for play_el in player_doc {
            url_str = play_el.inner_html();
            // println!("url:{}", url);
        }
        let start_index = match url_str.find("img-cdn2") {
            Some(index) => index,
            None => 0,
        };
        if start_index != 0 {
            url_str = String::from(url_str.substring(start_index, url_str.len()));
            let end_index = match url_str.find("mp3") {
                Some(index) => index,
                None => 0,
            };
            // println!("start_index: {}, end_index: {}", 0, end_index + 3);
            if start_index != 0 && end_index != 0 {
                let url_path = url_str.substring(0, end_index + 3);
                let mut url_str = String::from("https://");
                url_str.push_str(url_path);
                let obj = AudioItemInfo {
                    title: String::from(name.trim()),
                    url: url_str,
                };
                ret_arr.push(obj);
                // let item_str = format!("{}->{};", &name.trim(), url_path);
                // ret_str.push_str(&item_str);
            }
        }
    }
    Ok(web::Json(ret_arr))
}
