import { BuildObj } from "./build"
export const buildPlugin = () =>{
  return {
    name:"build-plugin",
    apply:"build",
    closeBundle(){
      const buildObj = new BuildObj();
      buildObj.buildMain()
      buildObj.buildPackageJson()
      buildObj.buildeInstaller()
    }
  }
}