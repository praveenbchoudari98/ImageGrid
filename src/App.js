import React from 'react';
import { firebaseDB, fireStorage } from "./firebase";
import './App.css';
import imageCompression from 'browser-image-compression';
class App extends React.Component {
  state={
    image:'',
    urlList:[],
    progress:0
  }
  componentDidMount(){
    let reference = firebaseDB.ref('data');
    reference.on("value", snapshot => {
      let urlList=[]
      snapshot.forEach(snap=>{
        urlList.push(snap.val());
      })
      this.setState({
        urlList:urlList.reverse()
      })
  })
}
  handleImageChange = async(e) => {
    if (e.target.files[0]) {
      const orgimage = e.target.files[0];
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        try {
          const image = await imageCompression(orgimage,options);
          await this.setState({image})
        } catch (error) {
          console.log(error);
        }
    }
  }
  handleUpload=()=>{
     const {image} = this.state;
  const uploadTask = fireStorage.ref(`images/${image.name}`).put(image);
  uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      this.setState({progress});
    },
    (error)=>{
      console.log(error);
    },
    ()=>{fireStorage.ref('images').child(image.name).getDownloadURL().then(url => {
        let reference = firebaseDB.ref('data');
        reference.push({imageURL:url});
        this.setState({progress:0})
          document.getElementById('image').value=''
      }
      ) 
  })

  }
  removeData=(i)=>{
    let index = i;
    let reference = firebaseDB.ref('data');
    let {urlList}=this.state;
    let val=urlList[index].imageURL;
    reference.orderByChild('imageURL').equalTo(val).on('value',snapshot=>{
      snapshot.forEach((snap)=>{
        reference.child(snap.key).remove();
      })
    })
  }
  render(){
    return (
      <div>
      <button>
      <label htmlFor='image'>Capture</label>
      </button>
      <input
    type="file"
    accept="image/*"
    capture
    id='image'
    style={{visibility:'hidden'}}
    onChange={(e)=>this.handleImageChange(e)}
      />
      <button type='submit'onClick={this.handleUpload}>Upload</button>
      {this.state.progress>0?`${this.state.progress}%`:null}
      <br/>
      <div className='card'>
      {this.state.urlList.map((data,i)=>(
        <div>
        <button class='close' style={{zIndex:1,bottom:'400px',background:'red'}} onClick={()=>this.removeData(i)}>
        <span>&times;</span>
        </button>
        <img src={data.imageURL} alt='' />
        </div>
        ))}
      </div>
    </div>
      );
    }
  }

export default App;