'use strict';
const db = require("./db");
const path = require("path");
const commonClass = require("./common");
var common=new commonClass();
var url = require('url');

module.exports=class Api{

 //-------------------------------  LOGIN SERVICE  -------------------------------------//
    login(data,deviceid,devicetype,res){
        if (!data.Email) {

            return res.send(common.errorInvalid("email"));
        }
        if (!data.Password) {

            return res.send(common.errorInvalid("password"));
        }
        if(!data.Secret){

            return res.send(common.errorInvalid("Secret"));
        }
        var generated_secret= common.secretGenerator(data.Email,data.Password);
        if(generated_secret != data.Secret){

            return res.send(common.errorDenied("Invalid secret."));
        }
        db.select('SELECT * FROM `tblusers` WHERE `Email` = "' +  data.Email +'" AND `Password` = "' + data.Password +'"', result => {

            if (result.length != 0) {

            var AccessToken = common.createAccessToken();
            var today = new Date();
            var AccessSession = today.setDate(today.getDate() + 365);

                if(deviceid!="" && devicetype!=""){

                        db.select("SELECT * FROM tblapisession WHERE UserId = '"+result[0].UserId+"' AND DeviceType = '"+devicetype+"' AND DeviceId = '"+deviceid+"'",function(result1){

                            if(result1.length == 0){

                                db.insert("INSERT INTO tblapisession SET AccessToken ='"+AccessToken+"',AccessSession ='"+AccessSession+"',UserId= '"+result[0].UserId+"',DeviceType = '"+devicetype+"',DeviceId = '"+deviceid+"',CreatedDate='"+ new Date().toISOString()+"',ModifiedDate='"+new Date().toISOString()+"'",()=>{});

                            }else{

                                db.update("UPDATE tblapisession SET AccessToken ='"+AccessToken+"',AccessSession ='"+AccessSession+"',ModifiedDate='"+new Date().toISOString()+"' WHERE UserId= '"+result[0].UserId+"' AND DeviceType = '"+devicetype+"' AND DeviceId = '"+deviceid+"'",()=>{});

                            }

                            var resArray={
                                "Name":result[0].FirstName,
                                "AccessToken":AccessToken
                            };

                            return res.send(common.apiSuccess(resArray,"success"));
                        });

                }
            }
            else
            {
                res.send(common.errorDenied("The username or password entered is incorrect."));
            }
        }
        );
    }

//-------------------------------  SIGN UP SERVICE  -------------------------------------//

    signUp(data,deviceid,devicetype,files,res){
        if (!data.FirstName) {

            return res.send(common.errorInvalid("FirstName"));
        }
        if (!data.LastName) {

            return res.send(common.errorInvalid("LastName"));
        }
        if(!data.Email){

            return res.send(common.errorInvalid("Email"));
        }
        if(!data.Password){

            return res.send(common.errorInvalid("Password"));
        }
        if(!data.Secret){

            return res.send(common.errorInvalid("Secret"));
        }

        //---------------------  AUTHENTICAT SECRET  --------------------//

        var Secret=common.secretGenerator(data.Email,data.Password);
        if(Secret != data.Secret){
            res.send(common.errorDenied("Invalid Secret"));
        }

        //------------  CHECK EMAIL ALREADY AVALIBLE OR NOT  -------------//

        db.select("select * from tblusers where Email='"+data.Email+"'",(result,error)=>{
                if(!error){
                    if(result.length==0){
                        var insData={};
                        if(files.ProfilePic){

                            var name = Date.now() + "_" + files.ProfilePic.name;
                            var newPath = path.join("./uploads", "user_profile", name);
                            files.ProfilePic.mv(newPath);
                            var ProfilePicPath='uploads/user_profile/'+name;
                            insData['ProfilePic']=ProfilePicPath;
                        }
                        insData['FirstName']=data.FirstName;
                        insData['LastName']=data.LastName;
                        insData['Email']=data.Email;
                        insData['Password']=data.Password;

                        //---------------------  ADD USER DATA  -----------------------//

                        db.insert("insert into tblusers SET ?",insData,(UserId,error)=>{
                            if(!error){
                                db.select("select * from tblusers where UserId='"+UserId+"'",(UserData,error)=>{
                                    if(UserData.length>0){
                                        var AccessToken = common.createAccessToken();
                                        var today = new Date();
                                        var AccessSession = today.setDate(today.getDate() + 365);
                                        if(deviceid!="" && devicetype!=""){

                                            db.select("SELECT * FROM tblapisession WHERE UserId = '"+UserData[0].UserId+"' AND DeviceType = '"+devicetype+"' AND DeviceId = '"+deviceid+"'",function(SessionData){

                                                if(SessionData.length == 0){

                                                    db.insert("INSERT INTO tblapisession SET AccessToken ='"+AccessToken+"',AccessSession ='"+AccessSession+"',UserId= '"+UserData[0].UserId+"',DeviceType = '"+devicetype+"',DeviceId = '"+deviceid+"',CreatedDate='"+ new Date().toISOString()+"',ModifiedDate='"+new Date().toISOString()+"'",()=>{});

                                                }else{

                                                    db.update("UPDATE tblapisession SET AccessToken ='"+AccessToken+"',AccessSession ='"+AccessSession+"',ModifiedDate='"+new Date().toISOString()+"' WHERE UserId= '"+result[0].UserId+"' AND DeviceType = '"+devicetype+"' AND DeviceId = '"+deviceid+"'",()=>{});

                                                }
                                                var resArr={};
                                                resArr['UserId']=UserData[0].UserId;
                                                resArr['FirstName']=UserData[0].FirstName||"";
                                                resArr['LastName']=UserData[0].LastName||"";
                                                resArr['Password']=UserData[0].Password||"";
                                                resArr['ProfilePic']=UserData[0].ProfilePic||"";
                                                resArr['UserType']=UserData[0].UserType||"";
                                                resArr['AccessToken']=AccessToken||"";
                                                res.send(common.apiSuccess(resArr,"SignUp Success"));
                                            });
                                        }
                                    }else{
                                        res.send(common.errorDenied("UserData not found."));
                                    }
                                });

                            }else{

                                res.send(common.errorDenied("Problem with the Server Try again later."));
                            }
                        });
                    }else{

                        res.send(common.errorDenied("Email address already in use. Please try another email."));
                    }
                }else{

                    res.send(common.errorDenied("Problem with the Server Try again later"));
                }
        });


    }

}


