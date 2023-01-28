use actix_web::{get, post, web, Responder, Result};
use std::fs;
use std::path::Path;

pub fn check_file_and_remove(path: &str) -> Result<()> {
    let exist = Path::new(path).exists();
    if exist {
        fs::remove_file(path)?;
    }
    Ok(())
}
