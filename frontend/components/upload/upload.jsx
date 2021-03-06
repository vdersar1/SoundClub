import React from 'react';
import Main from '../main.jsx';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSong } from '../../actions/song_actions.js';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showForm: false, audioFile: '',
                   audioUrl: '', imageFile: '',
                   imageUrl: '', title: '',
                   description: '', disableSubmit: false
                 }
    this.processAudioFile = this.processAudioFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this._cancel = this._cancel.bind(this);
    this._submit = this._submit.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ disableSubmit: false });
  }

  processAudioFile(e) {
    e.preventDefault();
    let file = e.currentTarget.files[0];
    let fileReader = new FileReader();

    fileReader.onloadstart = () => {
      this.setState({ showForm: true })
    }

    fileReader.onloadend = () => {
      this.setState({
        audioFile: file,
        audioUrl: fileReader.result
      })
    }

    if (file)
      fileReader.readAsDataURL(file);
  }

  uploadImage(e) {
    e.preventDefault();
    let file = e.currentTarget.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      // console.log("image load end");
      this.setState({
        imageFile:file,
        imageUrl: fileReader.result
      })
    }

    if (file)
      fileReader.readAsDataURL(file);
  }

  _update(field) {
    return (e) => this.setState({ [field] : e.target.value })
  }

  _cancel() {
    this.setState({ showForm: false });
    // this.props.router.push('/stream');
  }

  _submit(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("song[title]", this.state.title)
    formData.append("song[description]", this.state.description)
    formData.append("song[audio]", this.state.audioFile)
    formData.append("song[img]", this.state.imageFile)
    this.setState({ disableSubmit: true })

    this.props.createSong(formData).then(
      ({ song }) => { this.props.router.push(`songs/${song.id}`)})
  }

  render() {
    let image;
    let _errors;

    if (this.props.errors && Object.keys(this.props.errors).length !== 0) {
      _errors = this.props.errors.responseJSON
    }

    if (this.state.imageUrl) {
      image = <img className="upload-img-preview" src={this.state.imageUrl} />
      // console.log("rendering image object");
    } else {
      image = <img className="upload-img-preview" />
    }

    return(
      <Main>
        <div className="upload-wrapper">
            { /* Render if no audio file selected */}
            { !this.state.showForm &&
              <div className="upload">
                <div className="upload-header">Upload to SoundClub</div>
                <div className="upload-buttons">
                  <div className="upload-select-button-wrapper">
                    <label className="upload-select-file">Choose a file to upload
                      <input className="hidden" type="file" onChange={this.processAudioFile}/>
                    </label>
                  </div>
                </div>
              </div>
            }

            { /* Render if an audio file HAS been selected */}
            { this.state.showForm &&
              <div className="upload">
                <div className="upload-header">Upload to SoundClub</div>
                <form onSubmit={ this._submit }>
                  <div className="flex-row form-container">

                    <label className="flex-column">
                      {image}
                      <div className="upload-select-img">
                        <i className="fa fa-camera" />
                        <span>&nbsp;Upload Image*</span>
                      </div>
                      <input className="hidden" type="file" onChange={ this.uploadImage } />
                      { (_errors && _errors.img) ? <div className="error">Select Appropriate Album Art</div>  : <div></div> }
                    </label>

                    <div className="flex-column form-container">
                      <label> Title* </label>
                      <input id="title"
                        type="text"
                        name="title"
                        value={ this.state.title }
                        onChange={this._update("title")}/>
                      { (_errors && _errors.title) ? <div className="error">Enter Title</div>  : <div></div> }


                      <label>Description</label>
                      <input id="description"
                             type="textarea"
                             name="description"
                             value={ this.state.description }
                             onChange={this._update("description")}/>
                           { (_errors && _errors.audio_content_type) ? <div className="error">Audio Format is Invalid - Press Back</div>  : <div></div> }

                       <div className="submit-buttons">
                        <div className="cancel"
                                disabled={this.state.disableSubmit}
                                onClick={this._cancel}>Back</div>

                        <input className="submit"
                               value="Submit"
                               type="submit"
                               disabled={this.state.disableSubmit} />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            }
        </div>
      </Main>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  songs: state.songs,
  errors: state.songs.errors
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  createSong: (formData) => dispatch(createSong(formData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Upload));
