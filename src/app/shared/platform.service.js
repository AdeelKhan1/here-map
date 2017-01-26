export default class PlatformService {
    constructor() {
        this.platform;

        this.init();
    }

    init() {
        this.platform = new H.service.Platform({
            'app_id': 'rjavUTHi8Ro5SdWrQDHf',
            'app_code': 'b9naScHzM-oPSs6SopEtIw',
            'useHTTPS': true
        });
    }
}