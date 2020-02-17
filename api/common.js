'use strict';
const db = require("./db");
const md5=require("md5");
const generate = require('nanoid/generate')
var self;
class Common{

//--------------------  API ERROR  ------------------------//
    constructor(){
        self=this;
    }

    apiError(declaration, msg) {
        var response = {
            flag: "false",
            result: "error",
            declaration: declaration,
            msg: msg
        };

        return response;
    }

//----------------------  API SUCCESS  ---------------------------//

    apiSuccess(data, msg) {
        var response;
        var response = {
            flag: "false",
            result: "error"
        };
        response["flag"] = "true";
        response["result"] = "success";
        response["msg"] = msg;
        if (data != "") {

            response["data"] = data;
        }
        return JSON.stringify(response);
    }

//------------------------  API ERROR  ---------------------------//

    errorApi() {

        return self.apiError("apiError", "Bad API user or secret.");
    }
    errorDb() {

        return self.apiError("DATABASE_ERROR", "Unknown database error.");
    }
    errorInvalid(fieldname) {

        return self.apiError("INVALID_INPUT", "Invalid or missing " + fieldname + ".");
    }
    errorNotFound(item) {

        return self.apiError("NOT_FOUND", "Could not find " + item + ".");
    }
    errorDenied(msg) {

        return self.apiError("DENIED", msg);
    }
    errorDuplicate(msg) {

        return self.apiError("DUPLICATE_ENTRY", msg);
    }
    errorUnknownfunction(msg) {

        return self.apiError("UNKNOWN_ERROR", msg);
    }

//--------------------  COMMON FUNCTION  ------------------------//

    authenticateApiCall(req,res,AccessToken){

        var data=(typeof(req.body.data) == "object")?req.body.data:JSON.parse(req.body.data);
        var today = new Date();
        var AccessSession = today.setDate(today.getDate());
        var deviceid = req.headers.deviceid;
        var devicetype = req.headers.devicetype;
        db.select("SELECT * FROM tblapisession WHERE UserId = '"+data.UserId+"' AND AccessSession >= '"+AccessSession+"' AND AccessToken = '"+AccessToken+"' AND DeviceType = '"+devicetype+"' AND DeviceId = '"+deviceid+"'",function(row){
            if(row.length == 0)
                {
                    return res.send(self.errorDenied('User Session Expired,Please Login again'));

                }else{

                    self.apiRequest(req,res);
                }
        })
    }

 //-------------------  SECRATE GENERATOR  -----------------------//

    secretGenerator(emailId,password){

        var email = emailId.split("").reverse().join("");
        var pwd = password.split("").reverse().join("");

        return md5(email+pwd);

    }

//-------------------  GENERATE ACCESS TOCKEN  --------------------//

    createAccessToken() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 50 ; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

//-----------------------  GET USER DATA ---------------------------//


    getUserData(UserId,callback)
    {
        db.select("Select * from tblusers where UserId='"+UserId+"'",(response)=>{
            callback(response);
        });
    }

//----------------------- GENERATE UNIQUE ID  ------------------------//

    generateOrderId(){

        var id='#'+generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',8);
        return id;
    }

//------------------------- API REQUEST  ------------------------------//

    apiRequest(req,res){

        var apiRequest= req.body.api_request;
        var data=(typeof(req.body.data) == "object")?req.body.data:JSON.parse(req.body.data);
        var files=req.files||{};

        if(apiRequest == "login"){

            api.login(data,req.headers.deviceid,req.headers.devicetype,res);
        }
        if(apiRequest == "signUp"){

            api.signUp(data,req.headers.deviceid,req.headers.devicetype,files,res);
        }
        else{

            self.errorApi("No Request Found");
        }
    }



}



module.exports=Common;
const apiClass=require("./api");
const api=new apiClass();
