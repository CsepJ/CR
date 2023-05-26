const express = require("express");
const axios = require("axios").default;
const config = require("../config");
const path = require("path");
let app = express();
const defaultCode = {
   code: "7240073",
   name: "경신고등학교",
   eduCode: "D10",
   mealCode: 2
   };
   let format = x => x<10?"0"+x.toString():x.toString();
   app.set('views', path.join(__dirname,"/../view")); 
 app.set('view engine', 'ejs'); 
 app.use(express.json()); 
 app.use(express.urlencoded({ extended: false })); 
 app.use(express.static(path.join(__dirname, "/../static")));
app.get("/", (req,res) => {
	res.render("test.ejs");
});
app.post("/meal", async (req,res) => {
  let link = "https://open.neis.go.kr/hub/mealServiceDietInfo";
  let date = new Date();
  if(!(date.getDay()%6)){ date=new Date(date.getTime()+(date.getDay()?2:1)*24*60*60000); }
  let now = date.getFullYear()+format(date.getMonth()+1)+format(date.getDate());
  let result = (await axios({
    method: "GET",
    url: link,
    params: {
        "KEY": config.mealkey,
    	"Type": "json",
        "MMEAL_SC_CODE": defaultCode.mealCode.toString(),
        "ATPT_OFCDC_SC_CODE": defaultCode.eduCode,
        "SD_SCHUL_CODE": defaultCode.code,
        "MLSV_YMD": now,
        "pIndex": 1,
        "pSize": 5
   }
  }))["data"]["mealServiceDietInfo"][1]["row"][0];
          let timeSplit = result["MLSV_YMD"].match(/(\d{0,4})(\d{0,2})(\d{0,2})/), time = new Date(timeSplit[1], timeSplit[2], timeSplit[3]);
          res.json({title: result["SCHUL_NM"]+"의 "+time.getMonth()+"월 "+time.getDate()+"일 "+result["MMEAL_SC_NM"]+" 식단입니다.", text : result["DDISH_NM"].replace(/\((\d{1,}\.)*\)/g, "").trim().replace(/\s{2,}/g, " ").split(" ").map((e,i) => (i+1)+" :"+e).join("<br><br>").replace(/<br\/>/gi, "") });

});

app.listen(config.port, () => console.log("Server is running on port", config.port));
