'use strict';

var conf = require("./../../conf.js");

exports.postComplexity = function postComplexity(req, res,next) {
    let response = {};
    //console.log(req.body.value);
    let str = req.body.value.str;
    let strGreen = req.body.value.strGreen;
    let sentences = str.length;
    let sentenceGreen = strGreen.length;
    let text = (sentenceGreen*100)/sentences
    response.overall_ld = text.toFixed(2);
    //console.log(typeof response);
    //console.log(response);
    return new Promise(function(resolve, reject) {
        if (resolve) {
            res.status(200).json(response);
            resolve(response);
        }else{
            reject(null);
        }
        })
        .catch(function(err) {
          throw err;
        });
};
//~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~

exports.modeComplexity = function modeComplexity(req, res,next) {
    let response = {};
    //console.log(req.body.value);
    let str = "Kim loves going to the cinema";
    let mode = req.mode.value;
    let sentences = str.length;
    var includesStr = str.includes(mode);

    return new Promise(function(resolve, reject) {
            if (includesStr) {
                let modeVerbas = mode.length;
                let text = (modeVerbas*100)/sentences
                response.overall_ld = text.toFixed(2);
                res.status(200).json(response);
                resolve(response);
            }else{
                reject(null);
            }
        })
        .catch(function(err) {
          throw err;
        });
};