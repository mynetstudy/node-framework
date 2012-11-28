微博：<a href="http://weibo.com/sunblessyou">@灵魂猥亵</a>
邮箱：i@jiongsun.com


Actionscript的收、发包逻辑

	private function onProgress(evt:ProgressEvent):void
	{
		var length:uint = socket.readUnsignedInt();
		var data:String = socket.readUTFBytes(length);
		
		if(socket.bytesAvailable>=4) onProgress(null);
	}

	private function send(data:Object):void
	{
		var byteArray:ByteArray = new ByteArray();
		byteArray.writeUTF(Json.encode(data));
	
		socket.writeUnsignedInt(byteArray.length+4);
		socket.writeBytes(byteArray);
		socket.flush();
	}