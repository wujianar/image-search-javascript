class WujianAr {
    constructor(accessKey = '', accessSecret = '', endpointUrl = '') {
        this.accessKey = accessKey;
        this.accessSecret = accessSecret;
        this.endpointUrl = endpointUrl;
    }
    setEndpointUrl(endpointUrl) {
        this.endpointUrl = endpointUrl;
    }
    setToken(token) {
        this.token = token;
    }
    searchByFile(file) {
        const data = new FormData();
        data.append('file', file);
        return this.httpPost(data);
    }
    searchByBase64(image) {
        const data = { image: image.split('base64,').pop() };
        return this.httpPost(JSON.stringify(data));
    }
    getToken() {
        return this.token || this.generateToken();
    }
    /**
     * 生成token
     */
    generateToken() {
        const arr = {
            // 服务器或客户端密钥
            'accessKey': this.accessKey,
            // 有效期（时间戳）,使用毫秒
            'expires': new Date().getTime() + 600 * 1000
        };
        // 转换为JSON字符串
        const json = JSON.stringify(arr);
        // 计算签名，拼接JSON字符串与访问密钥，再使用sha256哈希生成签名
        const signature = window.sha256(json + this.accessSecret);
        // 原始token数据
        const raw = signature + json;
        // 转换为base64编码, 此token为最终的认证token, 在有效期内无需重新生成
        return WujianAr.base64Encode(raw);
    }
    /**
     * base64编码，微信小程序中不支持btoa方法
     * @param str
     */
    static base64Encode(str) {
        return window.btoa(str);
    }
    /**
     * 发送HTTP请求
     * @param data
     */
    httpPost(data) {
        let headers = new Headers({ 'Authorization': this.getToken() });
        if (!(data instanceof FormData)) {
            headers.append('content-type', 'application/json');
        }
        return window.fetch(this.endpointUrl + '/search', {
            method: 'POST',
            headers: headers,
            body: data
        }).then(res => res.json());
    }
}
