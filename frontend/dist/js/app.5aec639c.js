(function(){"use strict";var e={5529:function(e,t,i){var a=i(9242),n=i(3396);const r={class:"navbar navbar-expand-sm navbar-dark bg-primary px-3 mb-5"},s=(0,n._)("button",{class:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarTogglerDemo02","aria-controls":"navbarTogglerDemo02","aria-expanded":"false","aria-label":"Toggle navigation"},[(0,n._)("span",{class:"navbar-toggler-icon"})],-1),o={class:"collapse navbar-collapse",id:"navbarTogglerDemo02"},l={class:"navbar-nav mr-auto mt-2 mt-sm-0"},d={class:"nav-item active"},c={class:"nav-item active"};function p(e,t,i,a,p,h){const u=(0,n.up)("router-link"),_=(0,n.up)("router-view");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n._)("nav",r,[(0,n.Wm)(u,{class:"navbar-brand",to:"/"},{default:(0,n.w5)((()=>[(0,n.Uk)("Transcriptor")])),_:1}),s,(0,n._)("div",o,[(0,n._)("ul",l,[(0,n._)("li",d,[(0,n.Wm)(u,{to:"/",class:"nav-link mr-sm-3"},{default:(0,n.w5)((()=>[(0,n.Uk)("Create Transcript")])),_:1})]),(0,n._)("li",c,[(0,n.Wm)(u,{to:"/user",class:"nav-link"},{default:(0,n.w5)((()=>[(0,n.Uk)("My Videos and Transcripts")])),_:1})])])])]),(0,n.Wm)(_)],64)}var h={name:"App",components:{}},u=i(89);const _=(0,u.Z)(h,[["render",p]]);var m=_,v=(i(6642),i(2483)),g=i(7139),f=i.p+"img/edit_icon.ebecf3f9.svg",w=i.p+"img/delete_icon.4866ae52.svg";const T=e=>((0,n.dD)("data-v-1668e152"),e=e(),(0,n.Cn)(),e),y={id:"home_page"},b=T((()=>(0,n._)("h1",null,"Transcriber",-1))),k=T((()=>(0,n._)("hr",null,null,-1))),I=T((()=>(0,n._)("p",null,"upload a video file to transcribe",-1))),P={class:"custom-file"},F={class:"custom-file-label",for:"validatedCustomFile"},U=T((()=>(0,n._)("p",null,[(0,n.Uk)("You can add transcripts from the inputs or directly from the video previews."),(0,n._)("br"),(0,n.Uk)("disabling end time will automatically display the transcript till the next transcript is displayed."),(0,n._)("br"),(0,n.Uk)("Make sure transcripts do not overlap!")],-1))),S={class:"video_previews"},O=T((()=>(0,n._)("h3",{id:"start_preview_title"},"Start Frame",-1))),C={id:"end_preview_title"},E={id:"video_preview_start",ref:"video_start",controls:""},j={id:"video_preview_end",ref:"video_end",controls:""},x={class:"table"},D=T((()=>(0,n._)("thead",{class:"thead-light"},[(0,n._)("tr",null,[(0,n._)("th",{scope:"col",class:"column"},"Start"),(0,n._)("th",{scope:"col",class:"column"},"End"),(0,n._)("th",{scope:"col",class:"column"},"transcript"),(0,n._)("th",{scope:"col",class:"icon_column"},"Edit"),(0,n._)("th",{scope:"col",class:"icon_column"},"Delete")])],-1))),$=["id"],A=["id"],R={class:"transcript-form"},W=["readonly"],L={id:"transcription_input",ref:"transcription_input",class:"form-control",placeholder:"Enter transcript"},Z=T((()=>(0,n._)("h1",null,"Please Wait While We Process Your File.",-1))),B=[Z],V={id:"generated_video",ref:"generated_video",controls:""},Y={type:"video/mp4",ref:"generated_video_source"},M={kind:"captions",srclang:"en-us",label:"English",ref:"generated_transcript",default:""},z=T((()=>(0,n._)("button",{id:"download_link_button",class:"btn btn-primary"},"Download Generated Transcript",-1))),G=[z];function N(e,t,i,r,s,o){return(0,n.wg)(),(0,n.iD)("div",y,[b,k,(0,n.wy)((0,n._)("div",null,[I,(0,n._)("div",P,[(0,n._)("input",{type:"file",class:"custom-file-input",id:"validatedCustomFile",onChange:t[0]||(t[0]=(...e)=>o.handleFileUpload&&o.handleFileUpload(...e))},null,32),(0,n._)("label",F,(0,g.zw)(s.file_name),1)])],512),[[a.F8,s.show_initial_frame]]),(0,n.wy)((0,n._)("div",null,[U,(0,n._)("div",S,[(0,n._)("div",null,[O,(0,n.wy)((0,n._)("h3",C,"End Frame",512),[[a.F8,s.end_enabled]])]),(0,n._)("div",null,[(0,n._)("video",E,null,512),(0,n.wy)((0,n._)("video",j,null,512),[[a.F8,s.end_enabled]])])]),(0,n.wy)((0,n._)("table",x,[D,(0,n._)("thead",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(s.transcription,(e=>((0,n.wg)(),(0,n.iD)("tr",{key:e[0]+"_div",class:(0,g.C_)(e[0])},[(0,n._)("td",null,(0,g.zw)(e[1]),1),(0,n._)("td",null,(0,g.zw)(e[2]),1),(0,n._)("td",null,(0,g.zw)(e[3]),1),(0,n._)("td",null,[(0,n._)("img",{class:"edit_icon",id:e[0],onClick:t[1]||(t[1]=(...e)=>o.editTranscript&&o.editTranscript(...e)),src:f},null,8,$)]),(0,n._)("td",null,[(0,n._)("img",{class:"delete_icon",id:e[0],onClick:t[2]||(t[2]=(...e)=>o.deleteTranscript&&o.deleteTranscript(...e)),src:w},null,8,A)])],2)))),128))])],512),[[a.F8,s.show_table]]),(0,n._)("div",R,[(0,n._)("input",{id:"time_start_input",ref:"time_start",class:"form-control",onChange:t[3]||(t[3]=(...e)=>o.timeInputStart&&o.timeInputStart(...e))},null,544),(0,n._)("input",{id:"time_end_input",ref:"time_end",class:"form-control",placeholder:"End time is disabled.",onChange:t[4]||(t[4]=(...e)=>o.timeInputEnd&&o.timeInputEnd(...e)),readonly:!s.end_enabled},null,40,W),(0,n._)("input",{id:"end_active_input",ref:"end_active_input",class:"checkbox-input",type:"checkbox",checked:"",onClick:t[5]||(t[5]=(...e)=>o.ToogleEnd&&o.ToogleEnd(...e))},null,512),(0,n._)("input",L,null,512),(0,n._)("button",{id:"add_transcript",class:"btn btn-primary",onClick:t[6]||(t[6]=(...e)=>o.addTranscript&&o.addTranscript(...e))},"Add Transcript")]),(0,n._)("button",{onClick:t[7]||(t[7]=(...e)=>o.generateTranscript&&o.generateTranscript(...e)),id:"upload_button",class:"btn btn-primary"},"Transcribe Video")],512),[[a.F8,s.show_preview]]),(0,n.wy)((0,n._)("div",null,B,512),[[a.F8,s.show_waiting]]),(0,n.wy)((0,n._)("div",null,[(0,n._)("video",V,[(0,n._)("source",Y,null,512),(0,n._)("track",M,null,512)],512),(0,n._)("a",{onClick:t[8]||(t[8]=(...e)=>o.downloadTranscript&&o.downloadTranscript(...e))},G)],512),[[a.F8,s.show_generated]])])}i(6229),i(7330),i(2062),i(7658);var H=i(4161),q=i(6154),K={name:"IndexPage",props:["title_from_user"],data(){return{prev_upload_vid:null,show_initial_frame:!0,show_preview:!1,show_table:!1,show_waiting:!1,show_generated:!1,end_enabled:!0,file:null,file_name:"Choose file...",transcription:[],user_ip:null,api_link:"https://transcription-app.onrender.com"}},mounted(){this.video_start=this.$refs.video_start,this.video_end=this.$refs.video_end,this.video_start.addEventListener("timeupdate",(()=>{document.getElementById("time_start_input").value=this.timeToStr(this.video_start.currentTime)})),this.video_end.addEventListener("timeupdate",(()=>{document.getElementById("time_end_input").value=this.timeToStr(this.video_end.currentTime)})),document.getElementById("time_end_input").value=null,H.Z.get("https://api.ipify.org?format=json").then((e=>{this.user_ip=e.data.ip})).catch((e=>{console.error(e)})),null!=this.$route.params.title_from_user&&this.generatePreviouslyUploaded()},methods:{handleFileUpload(e){this.file=e.target.files[0],this.file.type.match("video/*")?(this.uploadVideo(),this.previewVideo()):(alert("Please provide only video file format."),this.file=null)},previewVideo(){const e=document.getElementById("video_preview_start"),t=document.getElementById("video_preview_end");this.file_name=this.file.name,this.displayPreview(),e.src=URL.createObjectURL(this.file),t.src=URL.createObjectURL(this.file),e.load(),t.load()},uploadVideo(){const e=new FormData;e.append("user_ip",this.user_ip),e.append("video",this.file);const t=this.api_link+"/api/add_video";H.Z.post(t,e,{headers:{"Content-Type":"multipart/form-data"}}).then((async e=>{this.TitleForAPI=await e.data.video_title})).catch((e=>{console.error(e.message),alert("There was an unexpected error, please try again!")}))},addTranscript(){var e=this.$refs.time_end.value,t=this.$refs.time_start.value,i=this.$refs.transcription_input.value;""==t||""==i?alert("Start time and transcripts cannot be empty!"):""==e?this.AddTranscriptToAPI(this.video_start.currentTime,-1,i):e<=t?alert("End time must be more than the start time!"):this.AddTranscriptToAPI(this.video_start.currentTime,this.video_end.currentTime,i)},ToogleEnd(){this.end_enabled=this.$refs.end_active_input.checked,this.end_enabled?document.getElementById("time_end_input").value=this.timeToStr(this.video_end.currentTime):document.getElementById("time_end_input").value=null},timeInputEnd(e){this.isValidTimeFormat(e.target.value)?this.video_end.currentTime=this.strToTime(e.target.value):e.target.value=this.timeToStr(this.video_end.currentTime)},timeInputStart(e){this.isValidTimeFormat(e.target.value)?this.video_start.currentTime=this.strToTime(e.target.value):e.target.value=this.timeToStr(this.video_end.currentTime)},isValidTimeFormat(e){const t=/^(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,2})$/;if(!t.test(e))return!1;const[,i,a,n,r]=e.match(t);return parseInt(i,10)>=0&&parseInt(i,10)<=23&&parseInt(a,10)>=0&&parseInt(a,10)<=59&&parseInt(n,10)>=0&&parseInt(n,10)<=59&&parseInt(r,10)>=0&&parseInt(r,10)<=999||void 0},timeToStr(e){if(isNaN(e))return"Invalid time";const t=Math.floor(e/3600),i=Math.floor(e/60)-60*t,a=Math.floor(e)-(3600*t+60*i),n=Math.floor(100*e)-(36e4*t+6e3*i+100*a);var r=`${this.toTwoDigitString(t)}:${this.toTwoDigitString(i)}:${this.toTwoDigitString(a)}.${this.toTwoDigitString(n)}`;return r},strToTime(e){const t=/^(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,2})$/,[,i,a,n,r]=e.match(t);var s=3600*parseFloat(i)+60*parseFloat(a)+parseFloat(n)+parseFloat(r)/100;return s},toTwoDigitString(e){return e.toString().padStart(2,"0")},AddTranscriptToAPI(e,t,i){var a;const n=this.api_link+"/api/add_transcript";var r={video_title:this.TitleForAPI,start_time:e,end_time:t,text:i};fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}).then((async n=>{n.ok?(a=await n.json(),-1==t?this.transcription.push([a["transcript_id"],this.timeToStr(e),"-",i]):this.transcription.push([a["transcript_id"],this.timeToStr(e),this.timeToStr(t),i]),this.$refs.transcription_input.value=null,this.show_table=!0):alert("There was an unexpected error, please try again!")})).catch((e=>{console.error(e.message),alert("There was an unexpected error, please try again!")}))},generateTranscript(){if(this.show_table){this.displayWaiting();const e=this.api_link+"/api/generate_transcript";(0,H.Z)({url:e,method:"POST",responseType:"blob",data:{headers:{"Content-Type":"application/json"},video_title:this.TitleForAPI}}).then((async e=>{this.generated_file=await e.data,this.displayGenerated()})).catch((e=>{"Request failed with status code 404"==e.message?(alert("Transcripts are overlapping!"),this.displayPreview()):(console.error(e.message),alert("There was an unexpected error, please try again!"))}))}else alert("Provide transcripts to generate video!")},downloadTranscript(){const e=this.TitleForAPI.split("."),t=e.slice(0,e.length-1).join(".")+".vtt";var i=t;(0,q.saveAs)(this.href,i)},editTranscript(e){var t=e.target.id;const i="http://127.0.0.1:5000/api/delete_transcript";(0,H.Z)({url:i,method:"POST",data:{headers:{"Content-Type":"application/json"},transcript_id:t}}).then((e=>{for(var i=0;i<this.transcription.length;i++)this.transcription[i][0]==t&&(document.getElementById("time_start_input").value=this.transcription[i][1],document.getElementById("time_end_input").value=this.transcription[i][2],document.getElementById("transcription_input").value=this.transcription[i][3],this.transcription.splice(i,1));0==this.transcription.length&&(this.show_table=!1)})).catch((e=>{"Request failed with status code 404"==e.message?alert("Transcript not found!"):(console.error(e.message),alert("There was an unexpected error, please try again!"))}))},deleteTranscript(e){var t=e.target.id;const i="http://127.0.0.1:5000/api/delete_transcript";(0,H.Z)({url:i,method:"POST",data:{headers:{"Content-Type":"application/json"},transcript_id:t}}).then((e=>{for(var i=0;i<this.transcription.length;i++)this.transcription[i][0]==t&&this.transcription.splice(i,1);0==this.transcription.length&&(this.show_table=!1)})).catch((e=>{"Request failed with status code 404"==e.message?alert("Transcript not found!"):(console.error(e.message),alert("There was an unexpected error, please try again!"))}))},generatePreviouslyUploaded(){var e=this.$route.params.title_from_user;const t=this.api_link+"/api/get_video";(0,H.Z)({url:t,method:"POST",responseType:"blob",data:{headers:{"Content-Type":"application/json"},video_title:e}}).then((async t=>{var i=await t.data;this.file=i,this.file_name=e,this.TitleForAPI=e,this.setupPreviouslyUploaded()})).catch((e=>{console.error(e.message),alert("There was an unexpected error, please try again!")}))},setupPreviouslyUploaded(){const e=document.getElementById("video_preview_start"),t=document.getElementById("video_preview_end");this.displayPreview(),e.src=URL.createObjectURL(this.file),t.src=URL.createObjectURL(this.file),e.load(),t.load()},displayPreview(){this.show_initial_frame=!1,this.show_preview=!0,this.show_table=!1,this.show_waiting=!1,this.show_generated=!1},displayGenerated(){this.show_initial_frame=!1,this.show_preview=!1,this.show_table=!1,this.show_waiting=!1,this.show_generated=!0,this.$refs.generated_video_source.src=URL.createObjectURL(this.file),this.$refs.generated_video.load(),this.href=URL.createObjectURL(this.generated_file),this.$refs.generated_transcript.src=this.href},displayWaiting(){this.show_initial_frame=!1,this.show_preview=!1,this.show_table=!1,this.show_waiting=!0,this.show_generated=!1}}};const J=(0,u.Z)(K,[["render",N],["__scopeId","data-v-1668e152"]]);var Q=J;const X=e=>((0,n.dD)("data-v-d1003922"),e=e(),(0,n.Cn)(),e),ee=X((()=>(0,n._)("h1",null,"Please Wait While We Get Your Files.",-1))),te=[ee],ie=X((()=>(0,n._)("h3",null,"Your Uploaded Videos",-1))),ae=X((()=>(0,n._)("hr",null,null,-1))),ne={class:"table"},re=X((()=>(0,n._)("thead",{class:"thead-light"},[(0,n._)("tr",null,[(0,n._)("th",{scope:"col",class:"column"},"Video File Name"),(0,n._)("th",{scope:"col",class:"column"},"Generated")])],-1))),se=X((()=>(0,n._)("button",{class:"btn btn-outline-primary"},"Generate",-1))),oe=["id"],le=X((()=>(0,n._)("h3",null,"You have no Uploads and generated transcripts.",-1))),de=[le];function ce(e,t,i,r,s,o){const l=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.wy)((0,n._)("div",null,te,512),[[a.F8,s.show_initial_frame]]),(0,n.wy)((0,n._)("div",null,[ie,ae,(0,n._)("table",ne,[re,(0,n._)("thead",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(s.video_titles,(e=>((0,n.wg)(),(0,n.iD)("tr",{ref_for:!0,ref:"table",key:e+"_div",class:(0,g.C_)(e+"_div")},[(0,n._)("td",null,[(0,n._)("p",null,(0,g.zw)(e),1)]),(0,n.wy)((0,n._)("td",null,[(0,n.Wm)(l,{to:{name:"IndexPageWithUserTitle",params:{title_from_user:e}}},{default:(0,n.w5)((()=>[se])),_:2},1032,["to"])],512),[[a.F8,null==s.titles[e]]]),(0,n.wy)((0,n._)("td",null,[(0,n._)("button",{class:"btn btn-outline-primary",id:s.titles[e],onClick:t[0]||(t[0]=(...e)=>o.downloadTranscript&&o.downloadTranscript(...e))},"Download",8,oe)],512),[[a.F8,null!=s.titles[e]]])],2)))),128))])])],512),[[a.F8,s.show_table]]),(0,n.wy)((0,n._)("div",null,de,512),[[a.F8,s.show_no_uploads]])],64)}var pe={name:"UserPage",data(){return{show_initial_frame:!0,show_table:!1,show_no_uploads:!1,user_ip:null,titles:null,video_titles:null}},mounted(){this.get_user_ip()},methods:{get_user_ip(){H.Z.get("https://api.ipify.org?format=json").then((e=>{this.user_ip=e.data.ip,this.display_user_generations()})).catch((e=>{console.error(e)}))},display_user_generations(){const e=this.api_link+"/api/get_titles";(0,H.Z)({url:e,method:"POST",data:{headers:{"Content-Type":"application/json"},user_ip:this.user_ip}}).then((async e=>{var t=await e.data;const i={};Object.entries(t).forEach((e=>{const[t,a]=e;i[t]=a})),Object.freeze(i),this.titles=i,this.video_titles=Object.keys(i),this.display_table()})).catch((e=>{console.error(e.message),alert("There was an unexpected error, please try again!")}))},downloadTranscript(e){var t=e.target.id;const i=this.api_link+"/api/download_transcript";(0,H.Z)({url:i,method:"POST",responseType:"blob",data:{headers:{"Content-Type":"application/json"},transcript_title:t}}).then((async e=>{var i=await e.data;(0,q.saveAs)(i,t)})).catch((e=>{console.error(e.message),alert("There was an unexpected error, please try again!")}))},generatePreviouslyUploaded(e){var t=e.target.id;const i=this.api_link+"/api/get_video";(0,H.Z)({url:i,method:"POST",responseType:"blob",data:{headers:{"Content-Type":"application/json"},video_title:t}}).then((async e=>{await e.data})).catch((e=>{console.error(e.message),alert("There was an unexpected error, please try again!")}))},display_table(){this.show_initial_frame=!1,"None"!=this.titles["videos"]?this.show_table=!0:this.show_no_uploads=!0}}};const he=(0,u.Z)(pe,[["render",ce],["__scopeId","data-v-d1003922"]]);var ue=he;const _e=[{path:"/",name:"IndexPage",component:Q,props:!0},{path:"/:title_from_user",name:"IndexPageWithUserTitle",component:Q,props:!0},{path:"/user",name:"UserPage",component:ue}],me=(0,v.p7)({history:(0,v.PO)(),routes:_e});var ve=me;(0,a.ri)(m).use(ve).mount("#app")}},t={};function i(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a].call(r.exports,r,r.exports,i),r.exports}i.m=e,function(){var e=[];i.O=function(t,a,n,r){if(!a){var s=1/0;for(c=0;c<e.length;c++){a=e[c][0],n=e[c][1],r=e[c][2];for(var o=!0,l=0;l<a.length;l++)(!1&r||s>=r)&&Object.keys(i.O).every((function(e){return i.O[e](a[l])}))?a.splice(l--,1):(o=!1,r<s&&(s=r));if(o){e.splice(c--,1);var d=n();void 0!==d&&(t=d)}}return t}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[a,n,r]}}(),function(){i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,{a:t}),t}}(),function(){i.d=function(e,t){for(var a in t)i.o(t,a)&&!i.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){i.p="/"}(),function(){var e={143:0};i.O.j=function(t){return 0===e[t]};var t=function(t,a){var n,r,s=a[0],o=a[1],l=a[2],d=0;if(s.some((function(t){return 0!==e[t]}))){for(n in o)i.o(o,n)&&(i.m[n]=o[n]);if(l)var c=l(i)}for(t&&t(a);d<s.length;d++)r=s[d],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return i.O(c)},a=self["webpackChunkfrontend"]=self["webpackChunkfrontend"]||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))}();var a=i.O(void 0,[998],(function(){return i(5529)}));a=i.O(a)})();
//# sourceMappingURL=app.5aec639c.js.map