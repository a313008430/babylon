import Core from "../core/Core";

export default class test {
    private name:any;
    constructor(name:any) {
        
        Core.evet.on('tt', this, this.evet);
        this.name = name;
        // this.evet = this.evet.bind(this);
    }

     evet(e) {
        console.log(this.name);
        if(e == 'remove'){
            this.remove();
        }
    }

    private moeve(){

    }

     remove(){
        Core.evet.off('tt', this, this.evet);
    }
}