import React, { createContext } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/base";
import Spinner from "../component/Spinner";
import Swal from "../config/Swal";
import withRouter from "../config/WithRouter";

export const EditorContext = createContext();

class EditorProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: {},
      content: null,
      isCreateNewFileModelOpen: false,
      isCreateNewFolderModelOpen: false,
      explorer: null,
      loading: false,
      selectedFiles: [],
      selectedTab: null,
      error: null,
    };
  }

  componentDidMount() {
    const loadThemeCode = async () => {
      this.setState({ loading: true });

      await axiosInstance
        .get("/theme/code", {
          params: {
            id: this.props.searchParams.get("id"),
          },
        })
        .then((response) => {
          this.setState({ code: response.data, loading: false });
        })
        .catch((error) => {
          Promise.resolve(this.setState({ loading: false })).then(() =>
            this.setState({
              error: "Something went wrong \n Please try after sometimes later",
            })
          );
        });
    };

    if (this.props.searchParams.get("id")) {
      loadThemeCode();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedTab !== this.state.selectedTab) {
      const selectedFiles = this.state.selectedFiles.map((file) => {
        if (file.path === prevState.selectedTab) {
          return { ...file, content: prevState.content };
        }
        return file;
      });

      this.setState({ selectedFiles });
    }
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
    const onSaveFileByCTRLPromise = axiosInstance.put(
      "/theme/file/",
      {
        content: this.state.content,
        path: this.state.explorer.path,
      },
      {
        params: {
          id: this.props.searchParams.get("id"),
        },
      }
    );

    toast.promise(onSaveFileByCTRLPromise, {
      loading: "Saving...",
      success: "File Saved Successfully",
      error: `Couldn't save file ${this.state.explorer?.name}`,
    });

    await onSaveFileByCTRLPromise.then(async (response) => {
      await axiosInstance
        .get("/theme/file/", {
          params: {
            path: this.state.explorer?.path,
          },
        })
        .then(({ data }) => {
          const { content, path } = data;

          const tempSelectedFiles = this.state.selectedFiles.map((file) => {
            if (file.path === path) {
              return { ...file, content };
            }
            return file;
          });

          Promise.resolve(
            this.setState({
              code: response.data,
              content,
              selectedFiles: tempSelectedFiles,
            })
          )
        });
    });
  };

  onDeleteFile = async (explorer) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${this.state?.explorer?.name} file!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const onDeleteFilePromise = axiosInstance.delete("/theme/file/", {
          params: {
            id: this.props.searchParams.get("id"),
            path: explorer.path,
          },
        });

        toast.promise(onDeleteFilePromise, {
          loading: "Deleting...",
          success: `${explorer.name} file is deleted successfully`,
          error: `Couldn't delete file ${explorer?.name}`,
        });

        await onDeleteFilePromise.then((response) => {
          const tempSelectedFiles = this.state.selectedFiles.filter(
            (file) => file.path !== explorer.path
          );

          const tempExplorer =
            explorer.name !== this?.state?.explorer?.name
              ? explorer
              : tempSelectedFiles.length
              ? tempSelectedFiles[0]
              : null;

          const tempContent =
            explorer?.name !== this?.state?.explorer?.name
              ? this.state.content
              : tempSelectedFiles.length
              ? tempSelectedFiles[0]?.content
              : null;

          this.setState({
            code: response.data,
            explorer: tempExplorer,
            selectedFiles: tempSelectedFiles,
            content: tempContent,
            selectedTab: tempExplorer?.path,
          });
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  };

  render() {
    console.log(" Selected Files ", this.state.selectedFiles);
    return (
      <EditorContext.Provider
        value={{
          ...this.state,
          onChangeState: this.onChangeState,
          toggleCreateNewFileModel: this.toggleCreateNewFileModel,
          toggleCreateNewFolderModel: this.toggleCreateNewFolderModel,
          onSaveFileByCTRL: this.onSaveFileByCTRL,
          onDeleteFile: this.onDeleteFile,
        }}
      >
        {this.state.loading ? <Spinner /> : this.props.children}
      </EditorContext.Provider>
    );
  }
}

export default withRouter(EditorProvider);
