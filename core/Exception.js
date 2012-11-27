function Exception()
{
	if (this instanceof Exception)
	{
        // 将参数转化为数组
        var args = Array.prototype.slice.call(arguments);

        // 存储错误号
        this.code = (typeof args[0] === 'number') ? args.shift() : 1;

        // 存储错误消息
        this.message = (typeof args[0] === 'string') ? args[0] : 'unknow error';

        // 寻出错误扩展信息
        this.data = (typeof args[1] instanceof Object) ? args[1] : {};

        // 初始化错误跟踪栈
        Error.captureStackTrace(this, Exception);
    }
    else
    {
        return new Exception(arguments[0], arguments[1], arguments[2]);
    }
}

require('util').inherits(Exception, Error);

/**
 * 将错误转换为可视信息
 *
 * @return Object
 */
Exception.prototype.toModel = function ()
{	
	return {
		ret 	: this.code,
		message : this.message,
		data    : this.data
	};
};

module.exports = Exception;