class App {
    private readonly allowedExt: string[] = ['jpg', 'png'];
    private readonly allowedSize: number = 1024 << 10;

    public run(): void {
        // 请从开发者中心获取
        const accessKey = '887f162aea684948a792533d5fef646d';
        const accessSecret = '6eFRLOyyMfbew0HanoWMZcsKBTgFAQVJqH1JJoNfTKCCml4yW3rRDuN4JeQS5kzK';
        const endpointUrl = 'https://887f162aea684948a792533d5fef646d.iss-cn1.wujianar.com';
        const wujianAr = new WujianAr(accessKey, accessSecret, endpointUrl);

        // 或使用预生成的token
        // const endpointUrl = 'https://887f162aea684948a792533d5fef646d.iss-cn1.wujianar.com';
        // const token = 'YzBiZmY3MTAyZDQ4NDk4ODY3NTkzODM2MjU1NTI3YmIzNGE2ZDdiZjY4NzU4N2NlMjBiYjFjODY4YzFmYTg0M3siYWNjZXNzS2V5IjoiODg3ZjE2MmFlYTY4NDk0OGE3OTI1MzNkNWZlZjY0NmQiLCJleHBpcmVzIjozMjY0OTIzMTI3NDIyfQ==';
        // const wujianAr = new WujianAr();
        // wujianAr.setEndpointUrl(endpointUrl);
        // wujianAr.setToken(token);

        document.querySelector('#file1').addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files[0];
            if (!this.valid(file)) {
                return;
            }

            wujianAr.searchByFile(file).then(msg => {
                this.showResult1(msg);
            }).catch(err => {
                this.showResult1(err);
            });
        }, false);

        document.querySelector('#file2').addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files[0];
            if (!this.valid(file)) {
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                wujianAr.searchByBase64(e.target.result).then(msg => {
                    this.showResult2(msg);
                }).catch(err => {
                    this.showResult2(err);
                });
            };
        }, false);
    }

    private showResult1(msg: any) {
        this.showResult('result1', msg);
    }

    private showResult2(msg: any) {
        this.showResult('result2', msg);
    }

    private showResult(target: string, msg: any) {
        document.querySelector(`#${target}`).innerHTML = JSON.stringify(msg, null, 4);
    }

    private valid(file: File): boolean {
        const ext = file.name.split('.').pop();
        if (this.allowedExt.indexOf(ext.toLowerCase()) === -1) {
            alert(`仅允许上传${this.allowedExt.join(',')}格式文件`);
            return false;
        }

        if (file.size > this.allowedSize) {
            alert(`仅允许上传${this.allowedSize >> 20}MB的文件`);
            return false;
        }

        return true;
    }
}