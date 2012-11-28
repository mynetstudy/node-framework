function Data(data)
{
	if (this instanceof Data)
    {
        return this.getBuffer(data);
    }
    else
    {
        return new Data(data);
    }
}

Data.prototype.getBuffer = function(data)
{
	delete data.to;

	var data = JSON.stringify(data);
	var buffer = new Buffer(data.length + 4);
	buffer.writeInt32BE(data.length, 0);
	buffer.write(data, 4, buffer.length, 'utf8');
	return buffer;
}

module.exports = Data;