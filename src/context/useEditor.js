import React, { createContext } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/base";
import Spinner from "../component/Spinner";

export const EditorContext = createContext();

export class EditorProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: {},
      content: null,
      isCreateNewFileModelOpen: false,
      isCreateNewFolderModelOpen: false,
      explorer: null,
      loading:false,
      selectedFiles:[],
    };
  }

  componentDidMount(){
    const loadThemeCode = async () => {
      
      this.setState({loading:true})

      await axiosInstance
        .get("/theme/code")
        .then((response) => {
          this.setState({ code: response.data,loading:false })
        })
        .catch((error) => console.log(" Error ", error));
    };

    loadThemeCode();
  }

  onChangeState = (data) => {
    this.setState(data);
  };

  toggleCreateNewFileModel = () => {
    this.setState({
      isCreateNewFileModelOpen: !this.state.isCreateNewFileModelOpen,
    });
  };

  toggleCreateNewFolderModel = () => {
    this.setState({
      isCreateNewFolderModelOpen: !this.state.isCreateNewFolderModelOpen,
    });
  };

  onSaveFileByCTRL = async () => {
    const onSaveFileByCTRLPromise = axiosInstance.put("/theme/file/", {
      content:this.state.content,
      path: this.state.explorer.path,
    });

    toast.promise(onSaveFileByCTRLPromise,{
      loading:"Saving...",
      success:"File Saved Successfully",
      error:`Couldn't save file ${this.state.explorer?.name}`
    })

    await onSaveFileByCTRLPromise.then(async (response) => {
      await axiosInstance
        .get("/theme/file/", {
          params: {
            path: this.state.explorer?.path,
          },
        })
        .then(({ data }) => {
          Promise.resolve(
            this.setState({ code: response.data, ...data })
          )
        });
    });
  };

  render() {
    return (
      <EditorContext.Provider
        value={{
          ...this.state,
          onChangeState: this.onChangeState,
          toggleCreateNewFileModel: this.toggleCreateNewFileModel,
          toggleCreateNewFolderModel: this.toggleCreateNewFolderModel,
          onSaveFileByCTRL: this.onSaveFileByCTRL,
        }}
      >
        {this.state.loading ? <Spinner /> : this.props.children}
      </EditorContext.Provider>
    );
  }
}
