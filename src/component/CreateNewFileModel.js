import React, { useContext, useState } from "react";
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { EditorContext } from "../context/useEditor";
import axiosInstance from "../api/base";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

function CreateNewFileModel(args) {
  const [fileName, setFileName] = useState("");
  const [searchParams,] = useSearchParams();

  const {
    isCreateNewFileModelOpen,
    toggleCreateNewFileModel,
    onChangeState,
    explorer,
    selectedFiles
  } = useContext(EditorContext);

  const onClick = async (e) => {
    e.preventDefault();

    const onCreateFilePromise = axiosInstance.post(
      `/theme/file/`,
      {
        file: fileName,
      },
      {
        params: {
          id:searchParams.get('id'),
          path: explorer.path
        },
      }
    );

    toast.promise(onCreateFilePromise, {
      loading: "Creating...",
      success: `${fileName} file is created successfully`,
      error: "Couldn't create a file!",
    });

    await onCreateFilePromise.then((response) => {
      const code = response.data.code;
      const explorer = response.data.explorer;
      const _selectedFiles = [...selectedFiles,explorer]

      Promise.resolve(
        onChangeState({
          code: code,
          isCreateNewFileModelOpen: false,
          explorer:explorer,
          content:explorer?.content,
          selectedFiles:_selectedFiles,
          selectedTab:explorer?.path
        })
      );
    });
  };

  return (
    <div>
      <Modal
        isOpen={isCreateNewFileModelOpen}
        toggle={toggleCreateNewFileModel}
        centered
        {...args}
      >
        <ModalHeader toggle={toggleCreateNewFileModel}>
          Please enter the file name.
        </ModalHeader>
        <ModalBody>
          <Form>
            <Label htmlFor="fileName">file Name</Label>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
            <small className="text-sm text-warning">
              Please enter file name with extension.
            </small>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleCreateNewFileModel}>
            Cancel
          </Button>{" "}
          <Button color="success" onClick={onClick}>
            Create File
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default CreateNewFileModel;
