(function (window) {
    var yl = window.yl || {
        /** 
			Convert string to utf-16
         * 将字符串转换成utf-16
         * @param {String} str 将字符串转换成utf-16
         * @returns {Array<undefined>}  返回utf-16的字节
         */
        ToUTF16: function (str) {
            var result = new Array();
            var k = 0;
            for (var i = 0; i < str.length; i++) {
                var j = str[i].charCodeAt(0);
                result[k++] = j & 0xFF;
                result[k++] = j >> 8;
            }
            return result;
        },
        /**
         * 计算数据合法 The calculation data is legal
         * @param {Array<undefined>} bytes
         */
        makeCrc16: function (bytes) {
            var CRC16_TABLE = 
            //udy-qawy-vyo
               [0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf,
                0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7,
                0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e,
                0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876,
                0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd,
                0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5,
                0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c,
                0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974,
                0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb,
                0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3,
                0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a,
                0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72,
                0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9,
                0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1,
                0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738,
                0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70,
                0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7,
                0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff,
                0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036,
                0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e,
                0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5,
                0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd,
                0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134,
                0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c,
                0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3,
                0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb,
                0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232,
                0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a,
                0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1,
                0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9,
                0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330,
                0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78]
            var value = 0xffff;
            for (var i = 0; i < bytes.length; i++) {
                // 1.value 右移8位(相当于除以256)
                // 2.value与进来的数据进行异或运算后再与0xFF进行与运算
                //    得到一个索引index，然后查找CRC16_TABLE表相应索引的数据
                // 1和2得到的数据再进行异或运算。
                value = (value >> 8) ^ CRC16_TABLE[(value ^ bytes[i]) & 0xff];
            }
            value = ~value & 0xffff;
            return [(value & 0xff00) >> 8, value & 255];
        },
        /**
         * Analyze ad screen text settings
         * 1 digit font + 6 digit background color + 6 digit foreground color + words such as: white me, red love character 0 (Song Ti) 000000 (background color is not currently supported) FF0000 (foreground color) me, if it is an emoticon, Then replace the word part with ≒ and add the three-digit emoticon number ≒001 to indicate emoticon 001
         * 解析广告屏文字设置
         * 1位字体+ 6位背景色 + 6位前景色颜色+ 字  如：白色的 我，红色的爱字  0(宋体)000000(背景色暂不支持)FF0000（前景色）我,如果是表情，则字部分用≒代替然后加三位表情编号  ≒001 表示001号表情
         * @param {any} text
         * Analyze ad screen text settings
         * 1 digit font + 6 digit background color + 6 digit foreground color + words such as: white me, red love character 0 (Song Ti) 000000 (background color is not currently supported) FF0000 (foreground color) me, if it is an emoticon, Then replace the word part with ≒ and add the three-digit emoticon number ≒001 to indicate emoticon 001
         * Analyze the text settings of the ad screen
         * 1 digit font + 6 digit background color + 6 digit foreground color + words such as: white me, red love character 0 (Song Ti) 000000 (background color is not currently supported) FF0000 (foreground color) me, if it is an emoticon, Then replace the word part with ≒ and add the three-digit emoticon number ≒001 to indicate emoticon 001
         * @param {any} text
         */
        analyzeText: function (text) {
            var databytes = [];
            //console.log(text.length);
            for (var index = 0; index < text.length; index++) {
				console.log(index);
				console.log(text[index]);
                if (text[index] == '≒') {//表情 expression
                    databytes.push(0);
                    databytes.push(0);
                    databytes.push(0);
                    databytes.push(0xd8);
                    var temptext = text.substring(index, index + 3);//表情编码 Emoticon coding
                    databytes.push(parseInt(temptext));
                    index += 2;
                    console.log(1);
                } else {
                    index += 7;//去掉前七个字符。
                    var ys = text.substring(index, index + 6);
                    index += 6;
                    if (text[index] == '≒') {//表情
                        index++;
                        databytes.push(0);
                        databytes.push(0);
                        databytes.push(0);
                        databytes.push(0xd8);
                        var temptext = text.substring(index, index + 3);//表情编码
                        databytes.push(parseInt(temptext));
                        index += 2;
                    } else {
                        var c = text[index];
                        if(text.length > index)
                        { 
							
							console.log("c is");
                        console.log(c); // Here it is undefined. Try why? fixed
                        var txBytes = yl.ToUTF16(c);
                        if (txBytes[0] < 0x20 && txBytes[1] == 00)//不可见字符?
                        {
                            continue;
                        }
                        databytes.push(parseInt(ys.substring(0, 2), 16));//字颜色
                        databytes.push(parseInt(ys.substring(2, 4), 16));
                        databytes.push(parseInt(ys.substring(4, 6), 16));

                        databytes.push(txBytes[1]);//字 word
                        databytes.push(txBytes[0]);
						}
						else
						{
							continue;                        
						}
                    }
                }
            }
            return databytes;
        },
        /**
Assemble data for internal use. If the length of the packet exceeds 247 bytes, it needs to be split into multiple pieces and sent
         * 组装数据，内部使用，如果包的长度超过247个字节 就需要拆分成多条发送
         * @param {Number} type 协议号，具体请参考文档  Agreement number, please refer to the document for details
         * @param {Array<undefined>} data 协议数据，不包含包头包尾等数据 Protocol data, does not include header and end data
         * @param {Number} [bluetoothDataLength=20] 蓝牙版本数据传输数据长度，默认是4.0，支持20个字节 Bluetooth version data transmission data length, the default is 4.0, supports 20 bytes
         */
        buildData: function (type, data, bluetoothDataLength) {
            //  var data = [].length;
            bluetoothDataLength = bluetoothDataLength || 20;//默认是4.0，支持20个字节
            var packageLength = data.length + 5;//包的总长度
            var head = [01, 0x21];//固定头部
            var end = [0x0d, 0x0a];//固定尾部
            var busData = [packageLength >> 8 & 255, packageLength & 255, type];//业务数据
            // busData.push(0);
            // busData.push(0x01);//信息序列号 使用1代替
            busData = busData.concat(data);
            var crc15code = yl.makeCrc16(busData);
            var package = head.concat(busData).concat(crc15code).concat(end);//完整的包
            var pageHead = [type];//蓝牙4.0每次只能传输20字节，4.2可以传输251个字节，这里以4.2为默认，就是251-每包的头4个 有效包的数据就是 251-4=247个可用数据
            //Bluetooth 4.0 can only transmit 20 bytes at a time, 4.2 can transmit 251 bytes, here 4.2 is the default, which is 251-the first 4 data of each packet. The data of a valid packet is 251-4=247 available data
            var packages = [];
            var packageDataLength = bluetoothDataLength - 4;
            var temppackage = package.slice(0, packageDataLength);
            var pageIndex = 1;
            while (temppackage.length != 0) {
                var temp = "";
                for (var t = 0; t < temppackage.length; t++) {
                    if (temppackage[t] < 15) {
                        temp += "0";
                    }
                    temp += (temppackage[t].toString(16));
                }
                console.log(temp);
                pageHead.push(pageIndex >> 8 & 255);//帧序号低8位 Low 8 bits of frame number
                pageHead.push(pageIndex & 255);//帧序号高8位 Low 8 bits of frame number
                pageHead.push(temppackage.length);//有效字节数 Effective bytes
                packages.push(pageHead.concat(temppackage));//写入一次完整的包 Write a complete package once
                temppackage = package.slice(pageIndex * packageDataLength, ++pageIndex * packageDataLength);
                pageHead = [type];
            }
            for (var i = 0; i < packages.length; i++) {
                var temp = "";
                for (var t = 0; t < packages[i].length; t++) {
                    if (packages[i][t] < 15) {
                        temp += "0";
                    }
                    temp += (packages[i][t].toString(16)); // It is being converted to hex string
                }
                console.log(temp);
                
            }
            console.log("packages");
            console.log(packages);
            return packages;//返回完整的包 
        },
        /**
         * 亮度调节包
         * @param {Number} brightness 屏幕亮度,有效值位0-255 值越高越亮
         */
        changeBrightness: function (brightness) {
            return yl.buildData(0x31, [brightness]);
        },
        /**
         * 屏控制 关屏、开屏、恢复出厂设置控制 Screen control Turn off the screen, turn on the screen, restore factory settings control
         * @param {Number} type 0关屏 1开屏 2恢复出厂设置 type 0 off screen 1 on screen 2 restore factory settings
         */
        controlDevice: function (type) {
            return yl.buildData(0x3C, [type, 0, 0]);
        },
        /**
         * 下发广告
         * @param {Number} id 广告编号
         * @param {Date} beginDate 开始播放日期
         * @param {Date} endDate 结束播放日期
         * @param {Number} priority 播放优先级 0立即播放(用于客户的即时消息) 其他值：非即时消息 Play priority 0 Play immediately (used for customer's instant message) Other values: non-instant message
         * @param {Number} frequency 每5分钟播放次数0表示不间断 Plays every 5 minutes 0 means uninterrupted
         * @param {Number} playCount  需要播放的总次数0为不限制 The total number of times to be played is 0 for unlimited
         * @param {Number} animation  动作方式 Action method
         * @param {Boolean} edging  是否有边框
         * @param {Boolean} coruscate  是否闪烁 Whether flashing
         * @param {Number} implant   0000  LOGO  0001  HHMMSS 0010   HHMM    0011   yyyyMMDD
		 * @param {Number} alignment 对齐方式 0嵌入 01靠右11中间10 靠左 Alignment 0 Embedded 01 Right 11 Middle 10 Left
         * @param {String} fontName 字体 目前只支持宋体 Font currently only supports Song Ti
         * @param {Number} fontSize 字体大小 font size
         * @param {Number} speed 播放速度  0-7
         * @param {String} text 广告文本
         */
        pushad: function ({id, beginDate, endDate, priority, frequency, playCount, animation,edging, coruscate, implant,alignment, fontName, fontSize, speed, text}) {
            var dataBytes = [id >> 56 & 255, id >> 48 & 255, id >> 40 & 255, id >> 32 & 255, id >> 24 & 255, id >> 16 & 255, id >> 8 & 255, id & 255];//广告编号
            console.log(text.length);
            if (typeof beginDate === "string") {
                beginDate = beginDate.replace(/-/g, '/');
                beginDate = new Date(beginDate);
                console.log(beginDate);
            }
            if (typeof endDate === "string") {
                endDate = endDate.replace(/-/g, '/');
                endDate = new Date(endDate);
                console.log(endDate);
            }
            //beginDate = new Date("19/01/2021");
            //endDate = new Date(endDate);
            dataBytes.push(beginDate.getFullYear() - 2000);//开始播放日期
            dataBytes.push(beginDate.getMonth() + 1);
            dataBytes.push(beginDate.getDate());
            dataBytes.push(beginDate.getHours());
            dataBytes.push(beginDate.getMinutes());
            dataBytes.push(beginDate.getSeconds());


            dataBytes.push(endDate.getFullYear() - 2000);//结束播放日期
            dataBytes.push(endDate.getMonth() + 1);
            dataBytes.push(endDate.getDate());
            dataBytes.push(endDate.getHours());
            dataBytes.push(endDate.getMinutes());
            dataBytes.push(endDate.getSeconds());
			
			/*
			dataBytes.push(2021);//开始播放日期
            dataBytes.push(1);
            dataBytes.push(19);
            dataBytes.push(16);
            dataBytes.push(44);
            dataBytes.push(10);


        	dataBytes.push(2021);//开始播放日期
            dataBytes.push(1);
            dataBytes.push(19);
            dataBytes.push(16);
            dataBytes.push(44);
            dataBytes.push(10);
			*/

            dataBytes.push(priority);//播放优先级
            dataBytes.push(frequency);//每5分钟播放次数0表示不间断

            dataBytes.push(playCount > 8 & 255);//播放次数
            dataBytes.push(playCount & 255);

            dataBytes.push(animation);//动作方式 Action method
            var effect = (edging ? 1 : 0) | (coruscate ? 1 : 0);//附加效果
			effect=speed<<2|effect;//把速度合并到效果里面
            dataBytes.push(effect);//附加效果

            dataBytes.push(0); //3位背景色，暂不支持
            dataBytes.push(0);
            dataBytes.push(0);

            dataBytes.push(1);//字体 1 宋体 固定

			/*
				全为0 表示无嵌入
				
				低2为对齐方式 01靠右11中间10 靠左
				低3-6位      0000  LOGO
				              0001  HHMMSS  
				              0010   HHMM
				              0011   yyyyMMDD
				              0100   DDMMYYYY
				7-8位  日期链接符  
				00 日期和时间使用-和: 
				01 使用汉字 如年月日时
				
				如嵌入 
				靠左 logo  二进制  00 0000 10        十进制    2
				靠左 HHMMSS  二进制  00 0001 10        十进制     6

			*/
		   if(alignment!=0){//有嵌入才进来 不然没意义
		     var implantData=alignment<<6|implant;
			   dataBytes.push(implantData);
		   }else{
			   dataBytes.push(0);  
		   }
            dataBytes.push(0); //预留5个
            dataBytes.push(0);
            dataBytes.push(0);
            dataBytes.push(0);
            dataBytes.push(0);

            dataBytes = dataBytes.concat(yl.analyzeText(text));//解析文本 Parse text
			console.log(dataBytes);
            return yl.buildData(0x37, dataBytes);
        },
        /**
         * 清除广告 
Clear ads
         * @param {Array<undefined>} 要清除广告的所有编号，全部请忽略该参数或传0、null等 
To clear all numbers of advertisements, please ignore this parameter or pass 0, null, etc.
         */
        clearAd: function (ids) {
            if (ids) {
                if (Array.isArray(ids)) {
                    return yl.buildData(0x38, [ids.length].concat(ids));
                }
                return yl.buildData(0x38, [ids.length, ids]);
            }
            return yl.buildData(0x38, [1, 0]);
        },
        /**
         * 解析设备返回结果，返回设备是否处理成功，如果设备处理失败，着需要重新发送 Analyze the results returned by the device, and return whether the device has processed successfully. If the device fails to process, it needs to be resent
         * @param {Array<undefined>} data
         */
        analyzeResult: function (data) {
            return data[7] == 0;//返回设备是否处理成功 Return whether the device is processed successfully
        }
        ,
        /**
         * 解析硬件版本
         * @param {any} data
         */
        analyzeVersion: function (data) {
            return data[0] << 24 | data[1] << 16 | data[2] << 8 | data[3];
        }
    };
    window.yl = yl;
})(window);
