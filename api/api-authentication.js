'use strict';
const express = require("express");
const route = express.Router();
var db = require("./db");
var Common=require("./common");
var common=new Common();

route.post('/',(req,res,next)=>{
    db.select("SELECT * FROM tbapimst where ApiId='" + req.body.api_id +"' AND ApiSecret='" + req.body.api_secret + "'",function(result,error) {
        if(!error){
           if(result.length>0){
                var request = req.body.api_request;
                var authorization = req.headers.authorization;
                if(request!="login" && request!="signUp"){
                    var authArr = authorization.split(" ");
                    var accessKey = authArr[0];
                    var accessToken = authArr[1];
                    if(req.headers.authorization != '' && req.headers.devicetype != '' && req.headers.deviceid != ''){
                        if(!accessKey){

                            return res.send(common.errorInvalid(res,"Missing Access Key"));
                        }
                        if(!accessToken){

                            return res.send(common.errorInvalid(res,"Missing Access Key"));
                        }
                        if(accessKey != "horse"){

                            return res.send(common.errorInvalid(res,"Invalid Access Key"));
                        }
                        else{

                            return common.authenticateApiCall(req,res,accessToken);
                        }
                    }
                    else{

                        return res.send(common.errorApi('Bad Api User or Secret'));
                    }
                }else{

                    return common.apiRequest(req,res);
                }
           }else{

                return res.send(common.errorApi('Bad Api User or Secret'));
           }
        }
    });
});
route.get('/test-api',(req,res,next)=>{
    res.render("api/test-api");
});

module.exports=route;