class WujianAr {
    private readonly accessKey: string;
    private readonly accessSecret: string;
    private endpointUrl: string;
    private token: string;

    constructor(accessKey: string = '', accessSecret: string = '', endpointUrl: string = '') {
        this.accessKey = accessKey;
        this.accessSecret = accessSecret;
        this.endpointUrl = endpointUrl;
    }

    public setEndpointUrl(endpointUrl: string): void {
        this.endpointUrl = endpointUrl;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public searchByFile(file: File): Promise<any> {
        const data = new FormData();
        data.append('file', file);
        return this.httpPost(data);
    }

    public searchByBase64(image: string): Promise<any> {
        const data = {image: image.split('base64,').pop()};
        return this.httpPost(JSON.stringify(data));
    }

    private getToken(): string {
        return this.token || this.generateToken();
    }

    /**
     * 生成token
     */
    private generateToken(): string {
        const arr = {
            // 服务器或客户端密钥
            'accessKey': this.accessKey,
            // 有效期（时间戳）,使用毫秒
            'expires': new Date().getTime() + 600 * 1000
        };

        // 转换为JSON字符串
        const json = JSON.stringify(arr);

        // 计算签名，拼接JSON字符串与访问密钥，再使用sha256哈希生成签名
        const signature = (<any>window).sha256(json + this.accessSecret);

        // 原始token数据
        const raw = signature + json;

        // 转换为base64编码, 此token为最终的认证token, 在有效期内无需重新生成
        return WujianAr.base64Encode(raw);
    }

    /**
     * base64编码，微信小程序中不支持btoa方法
     * @param str
     */
    private static base64Encode(str) {
        return window.btoa(str);
    }

    /**
     * 发送HTTP请求
     * @param data
     */
    private httpPost(data: any): Promise<any> {
        let headers: Headers = new Headers({'Authorization': this.getToken()});
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