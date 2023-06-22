
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var e;e||(e=typeof Module !== 'undefined' ? Module : {});null;
e.onRuntimeInitialized=function(){function a(g,m){switch(typeof m){case "boolean":gc(g,m?1:0);break;case "number":hc(g,m);break;case "string":ic(g,m,-1,-1);break;case "object":if(null===m)kb(g);else if(null!=m.length){var n=aa(m);jc(g,n,m.length,-1);ba(n)}else ya(g,"Wrong API use : tried to return a value of an unknown type ("+m+").",-1);break;default:kb(g)}}function b(g,m){for(var n=[],p=0;p<g;p+=1){var v=l(m+4*p,"i32"),y=kc(v);if(1===y||2===y)v=lc(v);else if(3===y)v=mc(v);else if(4===y){y=v;v=nc(y);
y=oc(y);for(var M=new Uint8Array(v),G=0;G<v;G+=1)M[G]=r[y+G];v=M}else v=null;n.push(v)}return n}function c(g,m){this.Ma=g;this.db=m;this.Ka=1;this.gb=[]}function d(g,m){this.db=m;m=ca(g)+1;this.Za=da(m);if(null===this.Za)throw Error("Unable to allocate memory for the SQL string");t(g,u,this.Za,m);this.fb=this.Za;this.Va=this.jb=null}function f(g){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=g){var m=this.filename,n="/",p=m;n&&(n="string"==typeof n?n:ea(n),p=m?z(n+"/"+m):n);m=fa(!0,
!0);p=ha(p,(void 0!==m?m:438)&4095|32768,0);if(g){if("string"==typeof g){n=Array(g.length);for(var v=0,y=g.length;v<y;++v)n[v]=g.charCodeAt(v);g=n}ia(p,m|146);n=ja(p,577);ka(n,g,0,g.length,0);la(n);ia(p,m)}}this.handleError(q(this.filename,h));this.db=l(h,"i32");pc(this.db);g=da(4);ma(g,"i8*");if(0!==qc(this.db,g,0))throw m=B(l(g,"i8*")),ba(g),Error("Failed to initialize series extension: "+m);ba(g);this.$a={};this.Oa={}}var h=C(4),k=e.cwrap,q=k("sqlite3_open","number",["string","number"]),x=k("sqlite3_close_v2",
"number",["number"]),w=k("sqlite3_exec","number",["number","string","number","number","number"]),A=k("sqlite3_changes","number",["number"]),S=k("sqlite3_prepare_v2","number",["number","string","number","number","number"]),nb=k("sqlite3_sql","string",["number"]),rc=k("sqlite3_normalized_sql","string",["number"]),ob=k("sqlite3_prepare_v2","number",["number","number","number","number","number"]),sc=k("sqlite3_bind_text","number",["number","number","number","number","number"]),pb=k("sqlite3_bind_blob",
"number",["number","number","number","number","number"]),tc=k("sqlite3_bind_double","number",["number","number","number"]),uc=k("sqlite3_bind_int","number",["number","number","number"]),vc=k("sqlite3_bind_parameter_index","number",["number","string"]),wc=k("sqlite3_step","number",["number"]),xc=k("sqlite3_errmsg","string",["number"]),yc=k("sqlite3_column_count","number",["number"]),zc=k("sqlite3_data_count","number",["number"]),Ac=k("sqlite3_column_double","number",["number","number"]),qb=k("sqlite3_column_text",
"string",["number","number"]),Bc=k("sqlite3_column_blob","number",["number","number"]),Cc=k("sqlite3_column_bytes","number",["number","number"]),Dc=k("sqlite3_column_type","number",["number","number"]),Ec=k("sqlite3_column_name","string",["number","number"]),Fc=k("sqlite3_reset","number",["number"]),Gc=k("sqlite3_clear_bindings","number",["number"]),Hc=k("sqlite3_finalize","number",["number"]),rb=k("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),
kc=k("sqlite3_value_type","number",["number"]),nc=k("sqlite3_value_bytes","number",["number"]),mc=k("sqlite3_value_text","string",["number"]),oc=k("sqlite3_value_blob","number",["number"]),lc=k("sqlite3_value_double","number",["number"]),hc=k("sqlite3_result_double","",["number","number"]),kb=k("sqlite3_result_null","",["number"]),ic=k("sqlite3_result_text","",["number","string","number","number"]),jc=k("sqlite3_result_blob","",["number","number","number","number"]),gc=k("sqlite3_result_int","",["number",
"number"]),ya=k("sqlite3_result_error","",["number","string","number"]),sb=k("sqlite3_aggregate_context","number",["number","number"]),pc=k("RegisterExtensionFunctions","number",["number"]),qc=k("sqlite3_series_init","number",["number","number","number"]);c.prototype.bind=function(g){if(!this.Ma)throw"Statement closed";this.reset();return Array.isArray(g)?this.yb(g):null!=g&&"object"===typeof g?this.zb(g):!0};c.prototype.step=function(){if(!this.Ma)throw"Statement closed";this.Ka=1;var g=wc(this.Ma);
switch(g){case 100:return!0;case 101:return!1;default:throw this.db.handleError(g);}};c.prototype.tb=function(g){null==g&&(g=this.Ka,this.Ka+=1);return Ac(this.Ma,g)};c.prototype.Db=function(g){null==g&&(g=this.Ka,this.Ka+=1);g=qb(this.Ma,g);if("function"!==typeof BigInt)throw Error("BigInt is not supported");return BigInt(g)};c.prototype.Eb=function(g){null==g&&(g=this.Ka,this.Ka+=1);return qb(this.Ma,g)};c.prototype.getBlob=function(g){null==g&&(g=this.Ka,this.Ka+=1);var m=Cc(this.Ma,g);g=Bc(this.Ma,
g);for(var n=new Uint8Array(m),p=0;p<m;p+=1)n[p]=r[g+p];return n};c.prototype.get=function(g,m){m=m||{};null!=g&&this.bind(g)&&this.step();g=[];for(var n=zc(this.Ma),p=0;p<n;p+=1)switch(Dc(this.Ma,p)){case 1:var v=m.useBigInt?this.Db(p):this.tb(p);g.push(v);break;case 2:g.push(this.tb(p));break;case 3:g.push(this.Eb(p));break;case 4:g.push(this.getBlob(p));break;default:g.push(null)}return g};c.prototype.getColumnNames=function(){for(var g=[],m=yc(this.Ma),n=0;n<m;n+=1)g.push(Ec(this.Ma,n));return g};
c.prototype.getAsObject=function(g,m){g=this.get(g,m);m=this.getColumnNames();for(var n={},p=0;p<m.length;p+=1)n[m[p]]=g[p];return n};c.prototype.getSQL=function(){return nb(this.Ma)};c.prototype.getNormalizedSQL=function(){return rc(this.Ma)};c.prototype.run=function(g){null!=g&&this.bind(g);this.step();return this.reset()};c.prototype.ob=function(g,m){null==m&&(m=this.Ka,this.Ka+=1);g=na(g);var n=aa(g);this.gb.push(n);this.db.handleError(sc(this.Ma,m,n,g.length-1,0))};c.prototype.xb=function(g,
m){null==m&&(m=this.Ka,this.Ka+=1);var n=aa(g);this.gb.push(n);this.db.handleError(pb(this.Ma,m,n,g.length,0))};c.prototype.nb=function(g,m){null==m&&(m=this.Ka,this.Ka+=1);this.db.handleError((g===(g|0)?uc:tc)(this.Ma,m,g))};c.prototype.Ab=function(g){null==g&&(g=this.Ka,this.Ka+=1);pb(this.Ma,g,0,0,0)};c.prototype.pb=function(g,m){null==m&&(m=this.Ka,this.Ka+=1);switch(typeof g){case "string":this.ob(g,m);return;case "number":this.nb(g,m);return;case "bigint":this.ob(g.toString(),m);return;case "boolean":this.nb(g+
0,m);return;case "object":if(null===g){this.Ab(m);return}if(null!=g.length){this.xb(g,m);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+g+").";};c.prototype.zb=function(g){var m=this;Object.keys(g).forEach(function(n){var p=vc(m.Ma,n);0!==p&&m.pb(g[n],p)});return!0};c.prototype.yb=function(g){for(var m=0;m<g.length;m+=1)this.pb(g[m],m+1);return!0};c.prototype.reset=function(){this.freemem();return 0===Gc(this.Ma)&&0===Fc(this.Ma)};c.prototype.freemem=function(){for(var g;void 0!==
(g=this.gb.pop());)ba(g)};c.prototype.free=function(){this.freemem();var g=0===Hc(this.Ma);delete this.db.$a[this.Ma];this.Ma=0;return g};d.prototype.next=function(){if(null===this.Za)return{done:!0};null!==this.Va&&(this.Va.free(),this.Va=null);if(!this.db.db)throw this.hb(),Error("Database closed");var g=oa(),m=C(4);ma(h,"i32");ma(m,"i32");try{this.db.handleError(ob(this.db.db,this.fb,-1,h,m));this.fb=l(m,"i32");var n=l(h,"i32");if(0===n)return this.hb(),{done:!0};this.Va=new c(n,this.db);this.db.$a[n]=
this.Va;return{value:this.Va,done:!1}}catch(p){throw this.jb=B(this.fb),this.hb(),p;}finally{qa(g)}};d.prototype.hb=function(){ba(this.Za);this.Za=null};d.prototype.getRemainingSQL=function(){return null!==this.jb?this.jb:B(this.fb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(d.prototype[Symbol.iterator]=function(){return this});f.prototype.run=function(g,m){if(!this.db)throw"Database closed";if(m){g=this.prepare(g,m);try{g.step()}finally{g.free()}}else this.handleError(w(this.db,
g,0,0,h));return this};f.prototype.exec=function(g,m,n){if(!this.db)throw"Database closed";var p=oa(),v=null;try{var y=ca(g)+1,M=C(y);t(g,r,M,y);var G=M;var H=C(4);for(g=[];0!==l(G,"i8");){ma(h,"i32");ma(H,"i32");this.handleError(ob(this.db,G,-1,h,H));var I=l(h,"i32");G=l(H,"i32");if(0!==I){y=null;v=new c(I,this);for(null!=m&&v.bind(m);v.step();)null===y&&(y={columns:v.getColumnNames(),values:[]},g.push(y)),y.values.push(v.get(null,n));v.free()}}return g}catch(pa){throw v&&v.free(),pa;}finally{qa(p)}};
f.prototype.each=function(g,m,n,p,v){"function"===typeof m&&(p=n,n=m,m=void 0);g=this.prepare(g,m);try{for(;g.step();)n(g.getAsObject(null,v))}finally{g.free()}if("function"===typeof p)return p()};f.prototype.prepare=function(g,m){ma(h,"i32");this.handleError(S(this.db,g,-1,h,0));g=l(h,"i32");if(0===g)throw"Nothing to prepare";var n=new c(g,this);null!=m&&n.bind(m);return this.$a[g]=n};f.prototype.iterateStatements=function(g){return new d(g,this)};f.prototype["export"]=function(){Object.values(this.$a).forEach(function(m){m.free()});
Object.values(this.Oa).forEach(ra);this.Oa={};this.handleError(x(this.db));var g=sa(this.filename);this.handleError(q(this.filename,h));this.db=l(h,"i32");return g};f.prototype.close=function(){null!==this.db&&(Object.values(this.$a).forEach(function(g){g.free()}),Object.values(this.Oa).forEach(ra),this.Oa={},this.handleError(x(this.db)),ta("/"+this.filename),this.db=null)};f.prototype.handleError=function(g){if(0===g)return null;g=xc(this.db);throw Error(g);};f.prototype.getRowsModified=function(){return A(this.db)};
f.prototype.create_function=function(g,m){Object.prototype.hasOwnProperty.call(this.Oa,g)&&(ra(this.Oa[g]),delete this.Oa[g]);var n=ua(function(p,v,y){v=b(v,y);try{var M=m.apply(null,v)}catch(G){ya(p,G,-1);return}a(p,M)},"viii");this.Oa[g]=n;this.handleError(rb(this.db,g,m.length,1,0,n,0,0,0));return this};f.prototype.create_aggregate=function(g,m){var n=m.init||function(){return null},p=m.finalize||function(H){return H},v=m.step;if(!v)throw"An aggregate function must have a step function in "+g;
var y={};Object.hasOwnProperty.call(this.Oa,g)&&(ra(this.Oa[g]),delete this.Oa[g]);m=g+"__finalize";Object.hasOwnProperty.call(this.Oa,m)&&(ra(this.Oa[m]),delete this.Oa[m]);var M=ua(function(H,I,pa){var Z=sb(H,1);Object.hasOwnProperty.call(y,Z)||(y[Z]=n());I=b(I,pa);I=[y[Z]].concat(I);try{y[Z]=v.apply(null,I)}catch(Jc){delete y[Z],ya(H,Jc,-1)}},"viii"),G=ua(function(H){var I=sb(H,1);try{var pa=p(y[I])}catch(Z){delete y[I];ya(H,Z,-1);return}a(H,pa);delete y[I]},"vi");this.Oa[g]=M;this.Oa[m]=G;this.handleError(rb(this.db,
g,v.length-1,1,0,0,M,G,0));return this};e.Database=f};var va=Object.assign({},e),wa="./this.program",xa="object"==typeof window,za="function"==typeof importScripts,Aa="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,D="",Ba,Ca,Da,fs,Ea,Fa;
if(Aa)D=za?require("path").dirname(D)+"/":__dirname+"/",Fa=()=>{Ea||(fs=require("fs"),Ea=require("path"))},Ba=function(a,b){Fa();a=Ea.normalize(a);return fs.readFileSync(a,b?void 0:"utf8")},Da=a=>{a=Ba(a,!0);a.buffer||(a=new Uint8Array(a));return a},Ca=(a,b,c)=>{Fa();a=Ea.normalize(a);fs.readFile(a,function(d,f){d?c(d):b(f.buffer)})},1<process.argv.length&&(wa=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!=typeof module&&(module.exports=e),e.inspect=function(){return"[Emscripten Module object]"};
else if(xa||za)za?D=self.location.href:"undefined"!=typeof document&&document.currentScript&&(D=document.currentScript.src),D=0!==D.indexOf("blob:")?D.substr(0,D.replace(/[?#].*/,"").lastIndexOf("/")+1):"",Ba=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},za&&(Da=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),Ca=(a,b,c)=>{var d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="arraybuffer";
d.onload=()=>{200==d.status||0==d.status&&d.response?b(d.response):c()};d.onerror=c;d.send(null)};var Ga=e.print||console.log.bind(console),Ha=e.printErr||console.warn.bind(console);Object.assign(e,va);va=null;e.thisProgram&&(wa=e.thisProgram);var Ia;e.wasmBinary&&(Ia=e.wasmBinary);var noExitRuntime=e.noExitRuntime||!0;"object"!=typeof WebAssembly&&E("no native wasm support detected");var Ja,Ka=!1,La="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;
function Ma(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.buffer&&La)return La.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var h=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|h);else{var k=a[b++]&63;f=224==(f&240)?(f&15)<<12|h<<6|k:(f&7)<<18|h<<12|k<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function B(a,b){return a?Ma(u,a,b):""}
function t(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var h=0;h<a.length;++h){var k=a.charCodeAt(h);if(55296<=k&&57343>=k){var q=a.charCodeAt(++h);k=65536+((k&1023)<<10)|q&1023}if(127>=k){if(c>=d)break;b[c++]=k}else{if(2047>=k){if(c+1>=d)break;b[c++]=192|k>>6}else{if(65535>=k){if(c+2>=d)break;b[c++]=224|k>>12}else{if(c+3>=d)break;b[c++]=240|k>>18;b[c++]=128|k>>12&63}b[c++]=128|k>>6&63}b[c++]=128|k&63}}b[c]=0;return c-f}
function ca(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);127>=d?b++:2047>=d?b+=2:55296<=d&&57343>=d?(b+=4,++c):b+=3}return b}var Na,r,u,Oa,F,J,Pa,Qa;function Ra(){var a=Ja.buffer;Na=a;e.HEAP8=r=new Int8Array(a);e.HEAP16=Oa=new Int16Array(a);e.HEAP32=F=new Int32Array(a);e.HEAPU8=u=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=J=new Uint32Array(a);e.HEAPF32=Pa=new Float32Array(a);e.HEAPF64=Qa=new Float64Array(a)}var K,Sa=[],Ta=[],Ua=[];
function Va(){var a=e.preRun.shift();Sa.unshift(a)}var Wa=0,Xa=null,Ya=null;function E(a){if(e.onAbort)e.onAbort(a);a="Aborted("+a+")";Ha(a);Ka=!0;throw new WebAssembly.RuntimeError(a+". Build with -sASSERTIONS for more info.");}function Za(){return L.startsWith("data:application/octet-stream;base64,")}var L;L="sql-wasm.wasm";if(!Za()){var $a=L;L=e.locateFile?e.locateFile($a,D):D+$a}
function ab(){var a=L;try{if(a==L&&Ia)return new Uint8Array(Ia);if(Da)return Da(a);throw"both async and sync fetching of the wasm failed";}catch(b){E(b)}}
function bb(){if(!Ia&&(xa||za)){if("function"==typeof fetch&&!L.startsWith("file://"))return fetch(L,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+L+"'";return a.arrayBuffer()}).catch(function(){return ab()});if(Ca)return new Promise(function(a,b){Ca(L,function(c){a(new Uint8Array(c))},b)})}return Promise.resolve().then(function(){return ab()})}var N,O;function cb(a){for(;0<a.length;)a.shift()(e)}
function l(a,b="i8"){b.endsWith("*")&&(b="*");switch(b){case "i1":return r[a>>0];case "i8":return r[a>>0];case "i16":return Oa[a>>1];case "i32":return F[a>>2];case "i64":return F[a>>2];case "float":return Pa[a>>2];case "double":return Qa[a>>3];case "*":return J[a>>2];default:E("invalid type for getValue: "+b)}return null}
function ma(a,b="i8"){b.endsWith("*")&&(b="*");switch(b){case "i1":r[a>>0]=0;break;case "i8":r[a>>0]=0;break;case "i16":Oa[a>>1]=0;break;case "i32":F[a>>2]=0;break;case "i64":O=[0,(N=0,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[a>>2]=O[0];F[a+4>>2]=O[1];break;case "float":Pa[a>>2]=0;break;case "double":Qa[a>>3]=0;break;case "*":J[a>>2]=0;break;default:E("invalid type for setValue: "+b)}}
var db=(a,b)=>{for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a},z=a=>{var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=db(a.split("/").filter(d=>!!d),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a},eb=a=>{var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b},fb=a=>{if("/"===
a)return"/";a=z(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)};function gb(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var a=new Uint8Array(1);return()=>{crypto.getRandomValues(a);return a[0]}}if(Aa)try{var b=require("crypto");return()=>b.randomBytes(1)[0]}catch(c){}return()=>E("randomDevice")}
function hb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!=typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=db(a.split("/").filter(d=>!!d),!b).join("/");return(b?"/":"")+a||"."}function na(a,b){var c=Array(ca(a)+1);a=t(a,c,0,c.length);b&&(c.length=a);return c}var ib=[];function jb(a,b){ib[a]={input:[],output:[],Ya:b};lb(a,mb)}
var mb={open:function(a){var b=ib[a.node.rdev];if(!b)throw new P(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.Ya.fsync(a.tty)},fsync:function(a){a.tty.Ya.fsync(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.Ya.ub)throw new P(60);for(var f=0,h=0;h<d;h++){try{var k=a.tty.Ya.ub(a.tty)}catch(q){throw new P(29);}if(void 0===k&&0===f)throw new P(6);if(null===k||void 0===k)break;f++;b[c+h]=k}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.Ya.kb)throw new P(60);
try{for(var f=0;f<d;f++)a.tty.Ya.kb(a.tty,b[c+f])}catch(h){throw new P(29);}d&&(a.node.timestamp=Date.now());return f}},tb={ub:function(a){if(!a.input.length){var b=null;if(Aa){var c=Buffer.alloc(256),d=0;try{d=fs.readSync(process.stdin.fd,c,0,256,-1)}catch(f){if(f.toString().includes("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==typeof readline&&(b=
readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=na(b,!0)}return a.input.shift()},kb:function(a,b){null===b||10===b?(Ga(Ma(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},fsync:function(a){a.output&&0<a.output.length&&(Ga(Ma(a.output,0)),a.output=[])}},ub={kb:function(a,b){null===b||10===b?(Ha(Ma(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},fsync:function(a){a.output&&0<a.output.length&&(Ha(Ma(a.output,0)),a.output=[])}},Q={Ra:null,Sa:function(){return Q.createNode(null,"/",16895,
0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new P(63);Q.Ra||(Q.Ra={dir:{node:{Qa:Q.Ha.Qa,Pa:Q.Ha.Pa,lookup:Q.Ha.lookup,bb:Q.Ha.bb,rename:Q.Ha.rename,unlink:Q.Ha.unlink,rmdir:Q.Ha.rmdir,readdir:Q.Ha.readdir,symlink:Q.Ha.symlink},stream:{Ua:Q.Ia.Ua}},file:{node:{Qa:Q.Ha.Qa,Pa:Q.Ha.Pa},stream:{Ua:Q.Ia.Ua,read:Q.Ia.read,write:Q.Ia.write,mb:Q.Ia.mb,cb:Q.Ia.cb,eb:Q.Ia.eb}},link:{node:{Qa:Q.Ha.Qa,Pa:Q.Ha.Pa,readlink:Q.Ha.readlink},stream:{}},qb:{node:{Qa:Q.Ha.Qa,Pa:Q.Ha.Pa},
stream:vb}});c=wb(a,b,c,d);16384===(c.mode&61440)?(c.Ha=Q.Ra.dir.node,c.Ia=Q.Ra.dir.stream,c.Ja={}):32768===(c.mode&61440)?(c.Ha=Q.Ra.file.node,c.Ia=Q.Ra.file.stream,c.Na=0,c.Ja=null):40960===(c.mode&61440)?(c.Ha=Q.Ra.link.node,c.Ia=Q.Ra.link.stream):8192===(c.mode&61440)&&(c.Ha=Q.Ra.qb.node,c.Ia=Q.Ra.qb.stream);c.timestamp=Date.now();a&&(a.Ja[b]=c,a.timestamp=c.timestamp);return c},Kb:function(a){return a.Ja?a.Ja.subarray?a.Ja.subarray(0,a.Na):new Uint8Array(a.Ja):new Uint8Array(0)},rb:function(a,
b){var c=a.Ja?a.Ja.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Ja,a.Ja=new Uint8Array(b),0<a.Na&&a.Ja.set(c.subarray(0,a.Na),0))},Hb:function(a,b){if(a.Na!=b)if(0==b)a.Ja=null,a.Na=0;else{var c=a.Ja;a.Ja=new Uint8Array(b);c&&a.Ja.set(c.subarray(0,Math.min(b,a.Na)));a.Na=b}},Ha:{Qa:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;16384===(a.mode&61440)?b.size=4096:32768===(a.mode&61440)?
b.size=a.Na:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.Bb=4096;b.blocks=Math.ceil(b.size/b.Bb);return b},Pa:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&Q.Hb(a,b.size)},lookup:function(){throw xb[44];},bb:function(a,b,c,d){return Q.createNode(a,b,c,d)},rename:function(a,b,c){if(16384===(a.mode&61440)){try{var d=yb(b,c)}catch(h){}if(d)for(var f in d.Ja)throw new P(55);
}delete a.parent.Ja[a.name];a.parent.timestamp=Date.now();a.name=c;b.Ja[c]=a;b.timestamp=a.parent.timestamp;a.parent=b},unlink:function(a,b){delete a.Ja[b];a.timestamp=Date.now()},rmdir:function(a,b){var c=yb(a,b),d;for(d in c.Ja)throw new P(55);delete a.Ja[b];a.timestamp=Date.now()},readdir:function(a){var b=[".",".."],c;for(c in a.Ja)a.Ja.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=Q.createNode(a,b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new P(28);
return a.link}},Ia:{read:function(a,b,c,d,f){var h=a.node.Ja;if(f>=a.node.Na)return 0;a=Math.min(a.node.Na-f,d);if(8<a&&h.subarray)b.set(h.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=h[f+d];return a},write:function(a,b,c,d,f,h){b.buffer===r.buffer&&(h=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Ja||a.Ja.subarray)){if(h)return a.Ja=b.subarray(c,c+d),a.Na=d;if(0===a.Na&&0===f)return a.Ja=b.slice(c,c+d),a.Na=d;if(f+d<=a.Na)return a.Ja.set(b.subarray(c,c+d),f),d}Q.rb(a,f+
d);if(a.Ja.subarray&&b.subarray)a.Ja.set(b.subarray(c,c+d),f);else for(h=0;h<d;h++)a.Ja[f+h]=b[c+h];a.Na=Math.max(a.Na,f+d);return d},Ua:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Na);if(0>b)throw new P(28);return b},mb:function(a,b,c){Q.rb(a.node,b+c);a.node.Na=Math.max(a.node.Na,b+c)},cb:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new P(43);a=a.node.Ja;if(f&2||a.buffer!==Na){if(0<c||c+b<a.length)a.subarray?a=a.subarray(c,c+b):a=Array.prototype.slice.call(a,
c,c+b);c=!0;b=65536*Math.ceil(b/65536);(f=zb(65536,b))?(u.fill(0,f,f+b),b=f):b=0;if(!b)throw new P(48);r.set(a,b)}else c=!1,b=a.byteOffset;return{Gb:b,wb:c}},eb:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new P(43);if(f&2)return 0;Q.Ia.write(a,b,0,d,c,!1);return 0}}},Ab=null,Bb={},R=[],Cb=1,T=null,Db=!0,P=null,xb={},U=(a,b={})=>{a=hb("/",a);if(!a)return{path:"",node:null};b=Object.assign({sb:!0,lb:0},b);if(8<b.lb)throw new P(32);a=db(a.split("/").filter(k=>!!k),!1);for(var c=Ab,d="/",
f=0;f<a.length;f++){var h=f===a.length-1;if(h&&b.parent)break;c=yb(c,a[f]);d=z(d+"/"+a[f]);c.Wa&&(!h||h&&b.sb)&&(c=c.Wa.root);if(!h||b.Ta)for(h=0;40960===(c.mode&61440);)if(c=Eb(d),d=hb(eb(d),c),c=U(d,{lb:b.lb+1}).node,40<h++)throw new P(32);}return{path:d,node:c}},ea=a=>{for(var b;;){if(a===a.parent)return a=a.Sa.vb,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}},Fb=(a,b)=>{for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%T.length},Gb=a=>{var b=
Fb(a.parent.id,a.name);if(T[b]===a)T[b]=a.Xa;else for(b=T[b];b;){if(b.Xa===a){b.Xa=a.Xa;break}b=b.Xa}},yb=(a,b)=>{var c;if(c=(c=Hb(a,"x"))?c:a.Ha.lookup?0:2)throw new P(c,a);for(c=T[Fb(a.id,b)];c;c=c.Xa){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Ha.lookup(a,b)},wb=(a,b,c,d)=>{a=new Ib(a,b,c,d);b=Fb(a.parent.id,a.name);a.Xa=T[b];return T[b]=a},Jb={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},Kb=a=>{var b=["r","w","rw"][a&3];a&512&&(b+="w");return b},Hb=(a,b)=>{if(Db)return 0;if(!b.includes("r")||
a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0},Lb=(a,b)=>{try{return yb(a,b),20}catch(c){}return Hb(a,"wx")},Mb=(a,b,c)=>{try{var d=yb(a,b)}catch(f){return f.La}if(a=Hb(a,"wx"))return a;if(c){if(16384!==(d.mode&61440))return 54;if(d===d.parent||"/"===ea(d))return 10}else if(16384===(d.mode&61440))return 31;return 0},Nb=(a=0)=>{for(;4096>=a;a++)if(!R[a])return a;throw new P(33);},Pb=(a,b)=>{Ob||(Ob=function(){this.ab={}},Ob.prototype={},
Object.defineProperties(Ob.prototype,{object:{get:function(){return this.node},set:function(c){this.node=c}},flags:{get:function(){return this.ab.flags},set:function(c){this.ab.flags=c}},position:{get:function(){return this.ab.position},set:function(c){this.ab.position=c}}}));a=Object.assign(new Ob,a);b=Nb(b);a.fd=b;return R[b]=a},vb={open:a=>{a.Ia=Bb[a.node.rdev].Ia;a.Ia.open&&a.Ia.open(a)},Ua:()=>{throw new P(70);}},lb=(a,b)=>{Bb[a]={Ia:b}},Qb=(a,b)=>{var c="/"===b,d=!b;if(c&&Ab)throw new P(10);
if(!c&&!d){var f=U(b,{sb:!1});b=f.path;f=f.node;if(f.Wa)throw new P(10);if(16384!==(f.mode&61440))throw new P(54);}b={type:a,Lb:{},vb:b,Fb:[]};a=a.Sa(b);a.Sa=b;b.root=a;c?Ab=a:f&&(f.Wa=b,f.Sa&&f.Sa.Fb.push(b))},ha=(a,b,c)=>{var d=U(a,{parent:!0}).node;a=fb(a);if(!a||"."===a||".."===a)throw new P(28);var f=Lb(d,a);if(f)throw new P(f);if(!d.Ha.bb)throw new P(63);return d.Ha.bb(d,a,b,c)},V=(a,b)=>ha(a,(void 0!==b?b:511)&1023|16384,0),Rb=(a,b,c)=>{"undefined"==typeof c&&(c=b,b=438);ha(a,b|8192,c)},Sb=
(a,b)=>{if(!hb(a))throw new P(44);var c=U(b,{parent:!0}).node;if(!c)throw new P(44);b=fb(b);var d=Lb(c,b);if(d)throw new P(d);if(!c.Ha.symlink)throw new P(63);c.Ha.symlink(c,b,a)},Tb=a=>{var b=U(a,{parent:!0}).node;a=fb(a);var c=yb(b,a),d=Mb(b,a,!0);if(d)throw new P(d);if(!b.Ha.rmdir)throw new P(63);if(c.Wa)throw new P(10);b.Ha.rmdir(b,a);Gb(c)},ta=a=>{var b=U(a,{parent:!0}).node;if(!b)throw new P(44);a=fb(a);var c=yb(b,a),d=Mb(b,a,!1);if(d)throw new P(d);if(!b.Ha.unlink)throw new P(63);if(c.Wa)throw new P(10);
b.Ha.unlink(b,a);Gb(c)},Eb=a=>{a=U(a).node;if(!a)throw new P(44);if(!a.Ha.readlink)throw new P(28);return hb(ea(a.parent),a.Ha.readlink(a))},Ub=(a,b)=>{a=U(a,{Ta:!b}).node;if(!a)throw new P(44);if(!a.Ha.Qa)throw new P(63);return a.Ha.Qa(a)},Vb=a=>Ub(a,!0),ia=(a,b)=>{a="string"==typeof a?U(a,{Ta:!0}).node:a;if(!a.Ha.Pa)throw new P(63);a.Ha.Pa(a,{mode:b&4095|a.mode&-4096,timestamp:Date.now()})},Wb=(a,b)=>{if(0>b)throw new P(28);a="string"==typeof a?U(a,{Ta:!0}).node:a;if(!a.Ha.Pa)throw new P(63);if(16384===
(a.mode&61440))throw new P(31);if(32768!==(a.mode&61440))throw new P(28);var c=Hb(a,"w");if(c)throw new P(c);a.Ha.Pa(a,{size:b,timestamp:Date.now()})},ja=(a,b,c)=>{if(""===a)throw new P(44);if("string"==typeof b){var d=Jb[b];if("undefined"==typeof d)throw Error("Unknown file open mode: "+b);b=d}c=b&64?("undefined"==typeof c?438:c)&4095|32768:0;if("object"==typeof a)var f=a;else{a=z(a);try{f=U(a,{Ta:!(b&131072)}).node}catch(h){}}d=!1;if(b&64)if(f){if(b&128)throw new P(20);}else f=ha(a,c,0),d=!0;if(!f)throw new P(44);
8192===(f.mode&61440)&&(b&=-513);if(b&65536&&16384!==(f.mode&61440))throw new P(54);if(!d&&(c=f?40960===(f.mode&61440)?32:16384===(f.mode&61440)&&("r"!==Kb(b)||b&512)?31:Hb(f,Kb(b)):44))throw new P(c);b&512&&!d&&Wb(f,0);b&=-131713;f=Pb({node:f,path:ea(f),flags:b,seekable:!0,position:0,Ia:f.Ia,Jb:[],error:!1});f.Ia.open&&f.Ia.open(f);!e.logReadFiles||b&1||(Xb||(Xb={}),a in Xb||(Xb[a]=1));return f},la=a=>{if(null===a.fd)throw new P(8);a.ib&&(a.ib=null);try{a.Ia.close&&a.Ia.close(a)}catch(b){throw b;
}finally{R[a.fd]=null}a.fd=null},Yb=(a,b,c)=>{if(null===a.fd)throw new P(8);if(!a.seekable||!a.Ia.Ua)throw new P(70);if(0!=c&&1!=c&&2!=c)throw new P(28);a.position=a.Ia.Ua(a,b,c);a.Jb=[]},Zb=(a,b,c,d,f)=>{if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(1===(a.flags&2097155))throw new P(8);if(16384===(a.node.mode&61440))throw new P(31);if(!a.Ia.read)throw new P(28);var h="undefined"!=typeof f;if(!h)f=a.position;else if(!a.seekable)throw new P(70);b=a.Ia.read(a,b,c,d,f);h||(a.position+=
b);return b},ka=(a,b,c,d,f)=>{if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(0===(a.flags&2097155))throw new P(8);if(16384===(a.node.mode&61440))throw new P(31);if(!a.Ia.write)throw new P(28);a.seekable&&a.flags&1024&&Yb(a,0,2);var h="undefined"!=typeof f;if(!h)f=a.position;else if(!a.seekable)throw new P(70);b=a.Ia.write(a,b,c,d,f,void 0);h||(a.position+=b);return b},sa=a=>{var b="binary";if("utf8"!==b&&"binary"!==b)throw Error('Invalid encoding type "'+b+'"');var c;var d=ja(a,d||0);
a=Ub(a).size;var f=new Uint8Array(a);Zb(d,f,0,a,0);"utf8"===b?c=Ma(f,0):"binary"===b&&(c=f);la(d);return c},$b=()=>{P||(P=function(a,b){this.node=b;this.Ib=function(c){this.La=c};this.Ib(a);this.message="FS error"},P.prototype=Error(),P.prototype.constructor=P,[44].forEach(a=>{xb[a]=new P(a);xb[a].stack="<generic error, no stack>"}))},ac,fa=(a,b)=>{var c=0;a&&(c|=365);b&&(c|=146);return c},cc=(a,b,c)=>{a=z("/dev/"+a);var d=fa(!!b,!!c);bc||(bc=64);var f=bc++<<8|0;lb(f,{open:h=>{h.seekable=!1},close:()=>
{c&&c.buffer&&c.buffer.length&&c(10)},read:(h,k,q,x)=>{for(var w=0,A=0;A<x;A++){try{var S=b()}catch(nb){throw new P(29);}if(void 0===S&&0===w)throw new P(6);if(null===S||void 0===S)break;w++;k[q+A]=S}w&&(h.node.timestamp=Date.now());return w},write:(h,k,q,x)=>{for(var w=0;w<x;w++)try{c(k[q+w])}catch(A){throw new P(29);}x&&(h.node.timestamp=Date.now());return w}});Rb(a,d,f)},bc,W={},Ob,Xb;
function dc(a,b,c){if("/"===b.charAt(0))return b;a=-100===a?"/":X(a).path;if(0==b.length){if(!c)throw new P(44);return a}return z(a+"/"+b)}
function ec(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&z(b)!==z(ea(f.node)))return-54;throw f;}F[c>>2]=d.dev;F[c+8>>2]=d.ino;F[c+12>>2]=d.mode;J[c+16>>2]=d.nlink;F[c+20>>2]=d.uid;F[c+24>>2]=d.gid;F[c+28>>2]=d.rdev;O=[d.size>>>0,(N=d.size,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[c+40>>2]=O[0];F[c+44>>2]=O[1];F[c+48>>2]=4096;F[c+52>>2]=d.blocks;O=[Math.floor(d.atime.getTime()/1E3)>>>0,(N=Math.floor(d.atime.getTime()/
1E3),1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[c+56>>2]=O[0];F[c+60>>2]=O[1];J[c+64>>2]=0;O=[Math.floor(d.mtime.getTime()/1E3)>>>0,(N=Math.floor(d.mtime.getTime()/1E3),1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[c+72>>2]=O[0];F[c+76>>2]=O[1];J[c+80>>2]=0;O=[Math.floor(d.ctime.getTime()/1E3)>>>0,(N=Math.floor(d.ctime.getTime()/1E3),1<=+Math.abs(N)?
0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[c+88>>2]=O[0];F[c+92>>2]=O[1];J[c+96>>2]=0;O=[d.ino>>>0,(N=d.ino,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[c+104>>2]=O[0];F[c+108>>2]=O[1];return 0}var fc=void 0;function Ic(){fc+=4;return F[fc-4>>2]}function X(a){a=R[a];if(!a)throw new P(8);return a}function Kc(a){return J[a>>2]+4294967296*F[a+4>>2]}
function Lc(a){var b=ca(a)+1,c=da(b);c&&t(a,r,c,b);return c}function Mc(a,b,c){function d(x){return(x=x.toTimeString().match(/\(([A-Za-z ]+)\)$/))?x[1]:"GMT"}var f=(new Date).getFullYear(),h=new Date(f,0,1),k=new Date(f,6,1);f=h.getTimezoneOffset();var q=k.getTimezoneOffset();F[a>>2]=60*Math.max(f,q);F[b>>2]=Number(f!=q);a=d(h);b=d(k);a=Lc(a);b=Lc(b);q<f?(J[c>>2]=a,J[c+4>>2]=b):(J[c>>2]=b,J[c+4>>2]=a)}function Nc(a,b,c){Nc.Cb||(Nc.Cb=!0,Mc(a,b,c))}var Oc;
Oc=Aa?()=>{var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:()=>performance.now();var Pc={};function Qc(){if(!Rc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:wa||"./this.program"},b;for(b in Pc)void 0===Pc[b]?delete a[b]:a[b]=Pc[b];var c=[];for(b in a)c.push(b+"="+a[b]);Rc=c}return Rc}var Rc,Y=void 0,Sc=[];
function ua(a,b){if(!Y){Y=new WeakMap;var c=K.length;if(Y)for(var d=0;d<0+c;d++){var f=K.get(d);f&&Y.set(f,d)}}if(Y.has(a))return Y.get(a);if(Sc.length)c=Sc.pop();else{try{K.grow(1)}catch(q){if(!(q instanceof RangeError))throw q;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}c=K.length-1}try{K.set(c,a)}catch(q){if(!(q instanceof TypeError))throw q;if("function"==typeof WebAssembly.Function){d=WebAssembly.Function;f={i:"i32",j:"i64",f:"f32",d:"f64",p:"i32"};for(var h={parameters:[],results:"v"==
b[0]?[]:[f[b[0]]]},k=1;k<b.length;++k)h.parameters.push(f[b[k]]);b=new d(h,a)}else{d=[1,96];f=b.slice(0,1);b=b.slice(1);h={i:127,p:127,j:126,f:125,d:124};k=b.length;128>k?d.push(k):d.push(k%128|128,k>>7);for(k=0;k<b.length;++k)d.push(h[b[k]]);"v"==f?d.push(0):d.push(1,h[f]);b=[0,97,115,109,1,0,0,0,1];f=d.length;128>f?b.push(f):b.push(f%128|128,f>>7);b.push.apply(b,d);b.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);b=new WebAssembly.Module(new Uint8Array(b));b=(new WebAssembly.Instance(b,{e:{f:a}})).exports.f}K.set(c,
b)}Y.set(a,c);return c}function ra(a){Y.delete(K.get(a));Sc.push(a)}var Tc=0,Uc=1;function aa(a){var b=Tc==Uc?C(a.length):da(a.length);a.subarray||a.slice||(a=new Uint8Array(a));u.set(a,b);return b}
function Vc(a,b,c,d){var f={string:w=>{var A=0;if(null!==w&&void 0!==w&&0!==w){var S=(w.length<<2)+1;A=C(S);t(w,u,A,S)}return A},array:w=>{var A=C(w.length);r.set(w,A);return A}};a=e["_"+a];var h=[],k=0;if(d)for(var q=0;q<d.length;q++){var x=f[c[q]];x?(0===k&&(k=oa()),h[q]=x(d[q])):h[q]=d[q]}c=a.apply(null,h);return c=function(w){0!==k&&qa(k);return"string"===b?B(w):"boolean"===b?!!w:w}(c)}
function Ib(a,b,c,d){a||(a=this);this.parent=a;this.Sa=a.Sa;this.Wa=null;this.id=Cb++;this.name=b;this.mode=c;this.Ha={};this.Ia={};this.rdev=d}Object.defineProperties(Ib.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});$b();T=Array(4096);Qb(Q,"/");V("/tmp");V("/home");V("/home/web_user");
(()=>{V("/dev");lb(259,{read:()=>0,write:(b,c,d,f)=>f});Rb("/dev/null",259);jb(1280,tb);jb(1536,ub);Rb("/dev/tty",1280);Rb("/dev/tty1",1536);var a=gb();cc("random",a);cc("urandom",a);V("/dev/shm");V("/dev/shm/tmp")})();(()=>{V("/proc");var a=V("/proc/self");V("/proc/self/fd");Qb({Sa:()=>{var b=wb(a,"fd",16895,73);b.Ha={lookup:(c,d)=>{var f=R[+d];if(!f)throw new P(8);c={parent:null,Sa:{vb:"fake"},Ha:{readlink:()=>f.path}};return c.parent=c}};return b}},"/proc/self/fd")})();
var Xc={a:function(a,b,c,d){E("Assertion failed: "+B(a)+", at: "+[b?B(b):"unknown filename",c,d?B(d):"unknown function"])},h:function(a,b){try{return a=B(a),ia(a,b),0}catch(c){if("undefined"==typeof W||!(c instanceof P))throw c;return-c.La}},H:function(a,b,c){try{b=B(b);b=dc(a,b);if(c&-8)return-28;var d=U(b,{Ta:!0}).node;if(!d)return-44;a="";c&4&&(a+="r");c&2&&(a+="w");c&1&&(a+="x");return a&&Hb(d,a)?-2:0}catch(f){if("undefined"==typeof W||!(f instanceof P))throw f;return-f.La}},i:function(a,b){try{var c=
R[a];if(!c)throw new P(8);ia(c.node,b);return 0}catch(d){if("undefined"==typeof W||!(d instanceof P))throw d;return-d.La}},g:function(a){try{var b=R[a];if(!b)throw new P(8);var c=b.node;var d="string"==typeof c?U(c,{Ta:!0}).node:c;if(!d.Ha.Pa)throw new P(63);d.Ha.Pa(d,{timestamp:Date.now()});return 0}catch(f){if("undefined"==typeof W||!(f instanceof P))throw f;return-f.La}},b:function(a,b,c){fc=c;try{var d=X(a);switch(b){case 0:var f=Ic();return 0>f?-28:Pb(d,f).fd;case 1:case 2:return 0;case 3:return d.flags;
case 4:return f=Ic(),d.flags|=f,0;case 5:return f=Ic(),Oa[f+0>>1]=2,0;case 6:case 7:return 0;case 16:case 8:return-28;case 9:return F[Wc()>>2]=28,-1;default:return-28}}catch(h){if("undefined"==typeof W||!(h instanceof P))throw h;return-h.La}},G:function(a,b){try{var c=X(a);return ec(Ub,c.path,b)}catch(d){if("undefined"==typeof W||!(d instanceof P))throw d;return-d.La}},l:function(a,b,c){try{b=c+2097152>>>0<4194305-!!b?(b>>>0)+4294967296*c:NaN;if(isNaN(b))return-61;var d=R[a];if(!d)throw new P(8);
if(0===(d.flags&2097155))throw new P(28);Wb(d.node,b);return 0}catch(f){if("undefined"==typeof W||!(f instanceof P))throw f;return-f.La}},B:function(a,b){try{if(0===b)return-28;var c=ca("/")+1;if(b<c)return-68;t("/",u,a,b);return c}catch(d){if("undefined"==typeof W||!(d instanceof P))throw d;return-d.La}},E:function(a,b){try{return a=B(a),ec(Vb,a,b)}catch(c){if("undefined"==typeof W||!(c instanceof P))throw c;return-c.La}},y:function(a,b,c){try{return b=B(b),b=dc(a,b),b=z(b),"/"===b[b.length-1]&&
(b=b.substr(0,b.length-1)),V(b,c),0}catch(d){if("undefined"==typeof W||!(d instanceof P))throw d;return-d.La}},D:function(a,b,c,d){try{b=B(b);var f=d&256;b=dc(a,b,d&4096);return ec(f?Vb:Ub,b,c)}catch(h){if("undefined"==typeof W||!(h instanceof P))throw h;return-h.La}},v:function(a,b,c,d){fc=d;try{b=B(b);b=dc(a,b);var f=d?Ic():0;return ja(b,c,f).fd}catch(h){if("undefined"==typeof W||!(h instanceof P))throw h;return-h.La}},t:function(a,b,c,d){try{b=B(b);b=dc(a,b);if(0>=d)return-28;var f=Eb(b),h=Math.min(d,
ca(f)),k=r[c+h];t(f,u,c,d+1);r[c+h]=k;return h}catch(q){if("undefined"==typeof W||!(q instanceof P))throw q;return-q.La}},s:function(a){try{return a=B(a),Tb(a),0}catch(b){if("undefined"==typeof W||!(b instanceof P))throw b;return-b.La}},F:function(a,b){try{return a=B(a),ec(Ub,a,b)}catch(c){if("undefined"==typeof W||!(c instanceof P))throw c;return-c.La}},p:function(a,b,c){try{return b=B(b),b=dc(a,b),0===c?ta(b):512===c?Tb(b):E("Invalid flags passed to unlinkat"),0}catch(d){if("undefined"==typeof W||
!(d instanceof P))throw d;return-d.La}},o:function(a,b,c){try{b=B(b);b=dc(a,b,!0);if(c){var d=Kc(c),f=F[c+8>>2];h=1E3*d+f/1E6;c+=16;d=Kc(c);f=F[c+8>>2];k=1E3*d+f/1E6}else var h=Date.now(),k=h;a=h;var q=U(b,{Ta:!0}).node;q.Ha.Pa(q,{timestamp:Math.max(a,k)});return 0}catch(x){if("undefined"==typeof W||!(x instanceof P))throw x;return-x.La}},e:function(){return Date.now()},j:function(a,b){a=new Date(1E3*Kc(a));F[b>>2]=a.getSeconds();F[b+4>>2]=a.getMinutes();F[b+8>>2]=a.getHours();F[b+12>>2]=a.getDate();
F[b+16>>2]=a.getMonth();F[b+20>>2]=a.getFullYear()-1900;F[b+24>>2]=a.getDay();var c=new Date(a.getFullYear(),0,1);F[b+28>>2]=(a.getTime()-c.getTime())/864E5|0;F[b+36>>2]=-(60*a.getTimezoneOffset());var d=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();c=c.getTimezoneOffset();F[b+32>>2]=(d!=c&&a.getTimezoneOffset()==Math.min(c,d))|0},w:function(a,b,c,d,f,h){try{var k=X(d);if(0!==(b&2)&&0===(c&2)&&2!==(k.flags&2097155))throw new P(2);if(1===(k.flags&2097155))throw new P(2);if(!k.Ia.cb)throw new P(43);
var q=k.Ia.cb(k,a,f,b,c);var x=q.Gb;F[h>>2]=q.wb;return x}catch(w){if("undefined"==typeof W||!(w instanceof P))throw w;return-w.La}},x:function(a,b,c,d,f,h){try{var k=X(f);if(c&2){var q=u.slice(a,a+b);k&&k.Ia.eb&&k.Ia.eb(k,q,h,b,d)}}catch(x){if("undefined"==typeof W||!(x instanceof P))throw x;return-x.La}},n:Nc,q:function(){return 2147483648},d:Oc,c:function(a){var b=u.length;a>>>=0;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);var f=Math;d=Math.max(a,
d);f=f.min.call(f,2147483648,d+(65536-d%65536)%65536);a:{try{Ja.grow(f-Na.byteLength+65535>>>16);Ra();var h=1;break a}catch(k){}h=void 0}if(h)return!0}return!1},z:function(a,b){var c=0;Qc().forEach(function(d,f){var h=b+c;f=J[a+4*f>>2]=h;for(h=0;h<d.length;++h)r[f++>>0]=d.charCodeAt(h);r[f>>0]=0;c+=d.length+1});return 0},A:function(a,b){var c=Qc();J[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});J[b>>2]=d;return 0},f:function(a){try{var b=X(a);la(b);return 0}catch(c){if("undefined"==
typeof W||!(c instanceof P))throw c;return c.La}},m:function(a,b){try{var c=X(a);r[b>>0]=c.tty?2:16384===(c.mode&61440)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){if("undefined"==typeof W||!(d instanceof P))throw d;return d.La}},u:function(a,b,c,d){try{a:{var f=X(a);a=b;for(var h=b=0;h<c;h++){var k=J[a>>2],q=J[a+4>>2];a+=8;var x=Zb(f,r,k,q);if(0>x){var w=-1;break a}b+=x;if(x<q)break}w=b}J[d>>2]=w;return 0}catch(A){if("undefined"==typeof W||!(A instanceof P))throw A;return A.La}},k:function(a,
b,c,d,f){try{b=c+2097152>>>0<4194305-!!b?(b>>>0)+4294967296*c:NaN;if(isNaN(b))return 61;var h=X(a);Yb(h,b,d);O=[h.position>>>0,(N=h.position,1<=+Math.abs(N)?0<N?(Math.min(+Math.floor(N/4294967296),4294967295)|0)>>>0:~~+Math.ceil((N-+(~~N>>>0))/4294967296)>>>0:0)];F[f>>2]=O[0];F[f+4>>2]=O[1];h.ib&&0===b&&0===d&&(h.ib=null);return 0}catch(k){if("undefined"==typeof W||!(k instanceof P))throw k;return k.La}},C:function(a){try{var b=X(a);return b.Ia&&b.Ia.fsync?b.Ia.fsync(b):0}catch(c){if("undefined"==
typeof W||!(c instanceof P))throw c;return c.La}},r:function(a,b,c,d){try{a:{var f=X(a);a=b;for(var h=b=0;h<c;h++){var k=J[a>>2],q=J[a+4>>2];a+=8;var x=ka(f,r,k,q);if(0>x){var w=-1;break a}b+=x}w=b}J[d>>2]=w;return 0}catch(A){if("undefined"==typeof W||!(A instanceof P))throw A;return A.La}}};
(function(){function a(f){e.asm=f.exports;Ja=e.asm.I;Ra();K=e.asm.Aa;Ta.unshift(e.asm.J);Wa--;e.monitorRunDependencies&&e.monitorRunDependencies(Wa);0==Wa&&(null!==Xa&&(clearInterval(Xa),Xa=null),Ya&&(f=Ya,Ya=null,f()))}function b(f){a(f.instance)}function c(f){return bb().then(function(h){return WebAssembly.instantiate(h,d)}).then(function(h){return h}).then(f,function(h){Ha("failed to asynchronously prepare wasm: "+h);E(h)})}var d={a:Xc};Wa++;e.monitorRunDependencies&&e.monitorRunDependencies(Wa);
if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return Ha("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return Ia||"function"!=typeof WebAssembly.instantiateStreaming||Za()||L.startsWith("file://")||Aa||"function"!=typeof fetch?c(b):fetch(L,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(h){Ha("wasm streaming compile failed: "+h);Ha("falling back to ArrayBuffer instantiation");return c(b)})})})();
return{}})();e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.J).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.K).apply(null,arguments)};e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.L).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.M).apply(null,arguments)};var Wc=e.___errno_location=function(){return(Wc=e.___errno_location=e.asm.N).apply(null,arguments)};
e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.O).apply(null,arguments)};e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.P).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.Q).apply(null,arguments)};e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.R).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.S).apply(null,arguments)};
e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.T).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.U).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.V).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.W).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm.X).apply(null,arguments)};
e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.Y).apply(null,arguments)};e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm.Z).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm._).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.$).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.aa).apply(null,arguments)};
e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ba).apply(null,arguments)};e._sqlite3_sql=function(){return(e._sqlite3_sql=e.asm.ca).apply(null,arguments)};e._sqlite3_aggregate_context=function(){return(e._sqlite3_aggregate_context=e.asm.da).apply(null,arguments)};e._sqlite3_column_count=function(){return(e._sqlite3_column_count=e.asm.ea).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.fa).apply(null,arguments)};
e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.ga).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ha).apply(null,arguments)};e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ia).apply(null,arguments)};e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ja).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.ka).apply(null,arguments)};
e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.la).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.ma).apply(null,arguments)};e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.na).apply(null,arguments)};e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.oa).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.pa).apply(null,arguments)};
e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.qa).apply(null,arguments)};e._sqlite3_normalized_sql=function(){return(e._sqlite3_normalized_sql=e.asm.ra).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.sa).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.ta).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.ua).apply(null,arguments)};
e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.va).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.wa).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.xa).apply(null,arguments)};var da=e._malloc=function(){return(da=e._malloc=e.asm.ya).apply(null,arguments)},ba=e._free=function(){return(ba=e._free=e.asm.za).apply(null,arguments)};
e._sqlite3_series_init=function(){return(e._sqlite3_series_init=e.asm.Ba).apply(null,arguments)};e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.Ca).apply(null,arguments)};
var zb=e._emscripten_builtin_memalign=function(){return(zb=e._emscripten_builtin_memalign=e.asm.Da).apply(null,arguments)},oa=e.stackSave=function(){return(oa=e.stackSave=e.asm.Ea).apply(null,arguments)},qa=e.stackRestore=function(){return(qa=e.stackRestore=e.asm.Fa).apply(null,arguments)},C=e.stackAlloc=function(){return(C=e.stackAlloc=e.asm.Ga).apply(null,arguments)};e.UTF8ToString=B;e.stackAlloc=C;e.stackSave=oa;e.stackRestore=qa;
e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(h=>"number"===h||"boolean"===h);return"string"!==b&&f&&!d?e["_"+a]:function(){return Vc(a,b,c,arguments)}};var Yc;Ya=function Zc(){Yc||$c();Yc||(Ya=Zc)};
function $c(){function a(){if(!Yc&&(Yc=!0,e.calledRun=!0,!Ka)){e.noFSInit||ac||(ac=!0,$b(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?cc("stdin",e.stdin):Sb("/dev/tty","/dev/stdin"),e.stdout?cc("stdout",null,e.stdout):Sb("/dev/tty","/dev/stdout"),e.stderr?cc("stderr",null,e.stderr):Sb("/dev/tty1","/dev/stderr"),ja("/dev/stdin",0),ja("/dev/stdout",1),ja("/dev/stderr",1));Db=!1;cb(Ta);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&
(e.postRun=[e.postRun]);e.postRun.length;){var b=e.postRun.shift();Ua.unshift(b)}cb(Ua)}}if(!(0<Wa)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)Va();cb(Sa);0<Wa||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();$c();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

"use strict";

var db;

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    var config = data["config"] ? data["config"] : {};
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"], config)
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done, config);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}
