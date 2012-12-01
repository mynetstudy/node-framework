微博：<a href="http://weibo.com/sunblessyou">@灵魂猥亵</a>
邮箱：i@jiongsun.com


Actionscript的收、发包逻辑

	private function onProgress(evt:ProgressEvent):void
	{
		var length:uint = socket.readUnsignedInt();
		var data:String = socket.readUTFBytes(length);
		
		trace(data);
		
		if(socket.bytesAvailable > 0) onProgress(null);
	}

	private function send(data:Object):void
	{
		var bytes2:ByteArray = new ByteArray();
		bytes2.writeUTF(Json.encode(data) + "\\0");
		
		var bytes:ByteArray = new ByteArray();
		bytes.writeBytes(bytes2, 2, bytes2.length - 2);
		
		socket.writeBytes(bytes);
		socket.flush();
	}