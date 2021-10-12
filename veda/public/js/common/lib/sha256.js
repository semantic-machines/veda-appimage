"use strict";System.register([],function(a){"use strict";var k,m;return{setters:[],execute:function(){/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */ /*  SHA-256 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk    */ /*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */ /*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */ /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */ // Sha256 namespace
/**
 * Generates SHA-256 hash of string
 *
 * @param {String} msg                String to be hashed
 * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
 * @returns {String}                  Hash of msg as hex character string
 */ //
// hexadecimal representation of a number 
//   (note toString(16) is implementation-dependant, and  
//   in IE returns signed numbers when used on full words)
//
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */ /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */ /*              single-byte character encoding (c) Chris Veness 2002-2010                         */ /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */ // Utf8 namespace
/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */ /**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */k={},a("default",k),k.hash=function(n,o){o=!("undefined"!=typeof o)||o,o&&(n=m.encode(n));// constants [§4.2.2]
var p=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],q=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];// initial hash value [§5.3.1]
n+=String.fromCharCode(128);for(var r=n.length/4+2,l=Math.ceil(r/16),s=Array(l),u=0;u<l;u++){s[u]=Array(16);for(var v=0;16>v;v++)// encode 4 chars per integer, big-endian encoding
s[u][v]=n.charCodeAt(64*u+4*v)<<24|n.charCodeAt(64*u+4*v+1)<<16|n.charCodeAt(64*u+4*v+2)<<8|n.charCodeAt(64*u+4*v+3);// note running off the end of msg is ok 'cos bitwise ops on NaN return 0
}// add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
// note: most significant word would be (len-1)*8 >>> 32, but since JS converts
// bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
s[l-1][14]=8*(n.length-1)/Math.pow(2,32),s[l-1][14]=Math.floor(s[l-1][14]),s[l-1][15]=4294967295&8*(n.length-1);for(var w,x,y,z,A,B,C,D,E=Array(64),u=0;u<l;u++){// 1 - prepare message schedule 'W'
for(var F=0;16>F;F++)E[F]=s[u][F];for(var F=16;64>F;F++)E[F]=4294967295&k.sigma1(E[F-2])+E[F-7]+k.sigma0(E[F-15])+E[F-16];// 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
w=q[0],x=q[1],y=q[2],z=q[3],A=q[4],B=q[5],C=q[6],D=q[7];// 3 - main loop (note 'addition modulo 2^32')
for(var F=0;64>F;F++){var G=D+k.Sigma1(A)+k.Ch(A,B,C)+p[F]+E[F],H=k.Sigma0(w)+k.Maj(w,x,y);D=C,C=B,B=A,A=4294967295&z+G,z=y,y=x,x=w,w=4294967295&G+H}// 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
q[0]=4294967295&q[0]+w,q[1]=4294967295&q[1]+x,q[2]=4294967295&q[2]+y,q[3]=4294967295&q[3]+z,q[4]=4294967295&q[4]+A,q[5]=4294967295&q[5]+B,q[6]=4294967295&q[6]+C,q[7]=4294967295&q[7]+D}return k.toHexStr(q[0])+k.toHexStr(q[1])+k.toHexStr(q[2])+k.toHexStr(q[3])+k.toHexStr(q[4])+k.toHexStr(q[5])+k.toHexStr(q[6])+k.toHexStr(q[7])},k.ROTR=function(a,b){return b>>>a|b<<32-a},k.Sigma0=function(a){return k.ROTR(2,a)^k.ROTR(13,a)^k.ROTR(22,a)},k.Sigma1=function(a){return k.ROTR(6,a)^k.ROTR(11,a)^k.ROTR(25,a)},k.sigma0=function(a){return k.ROTR(7,a)^k.ROTR(18,a)^a>>>3},k.sigma1=function(a){return k.ROTR(17,a)^k.ROTR(19,a)^a>>>10},k.Ch=function(a,b,c){return a&b^~a&c},k.Maj=function(a,b,c){return a&b^a&c^b&c},k.toHexStr=function(a){for(var b,c="",d=7;0<=d;d--)b=15&a>>>4*d,c+=b.toString(16);return c},m={},m.encode=function(a){// use regular expressions & String.replace callback function for better efficiency 
// than procedural approaches
var b=a.replace(/[\u0080-\u07ff]/g,// U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
function(a){var b=a.charCodeAt(0);return String.fromCharCode(192|b>>6,128|63&b)});return b=b.replace(/[\u0800-\uffff]/g,// U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
function(a){var b=a.charCodeAt(0);return String.fromCharCode(224|b>>12,128|63&b>>6,128|63&b)}),b},m.decode=function(a){// note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
var b=a.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,// 3-byte chars
function(a){// (note parentheses for precence)
var b=(15&a.charCodeAt(0))<<12|(63&a.charCodeAt(1))<<6|63&a.charCodeAt(2);return String.fromCharCode(b)});return b=b.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,// 2-byte chars
function(a){// (note parentheses for precence)
var b=(31&a.charCodeAt(0))<<6|63&a.charCodeAt(1);return String.fromCharCode(b)}),b}}}});
//# sourceMappingURL=sha256.js.map