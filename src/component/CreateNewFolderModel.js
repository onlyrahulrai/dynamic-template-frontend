import React, { useContext, useState } from "react";
import {
  Button,
  Form,
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

function CreateNewFolderModel(args) {
  const [folderName, setFolderName] = useState("");
  const [searchParams,] = useSearchParams();

  const {
    isCreateNewFolderModelOpen,
    toggleCreateNewFolderModel,
    onChangeState,
    explorer,
  } = useContext(EditorContext);

  const onClick = async (e) => {
    e.preventDefault();

    const onCreateFolderPromise = axiosInstance.post(
      `/editor/folder/`,
      {
        folder: folderName,
      },
      {
        params: {
          id:searchParams.get('id'),
          path: explorer.path,
        },
      }
    );

    toast.promise(onCreateFolderPromise, {
      loading: "Creating...",
      success: `${folderName} folder is created successfully`,
      error: "Couldn't create a folder!",
    });

    await onCreateFolderPromise.then((response) => {
      Promise.resolve(
        onChangeState({
          code: response.data,
          isCreateNewFolderModelOpen: false,
        })
      );
    });
  };

  return (
    <div>
      <Modal
        isOpen={isCreateNewFolderModelOpen}
        toggle={toggleCreateNewFolderModel}
        centered
        {...args}
      >
        <ModalHeader toggle={toggleCreateNewFolderModel}>
          Please enter the folder name.
        </ModalHeader>
        <ModalBody>
          <Form>
            <Label htmlFor="folderName">Folder Name</Label>
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required
              className="form-control"
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleCreateNewFolderModel}>
            Cancel
          </Button>{" "}
          <Button color="success" onClick={onClick}>
            Create Folder
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default CreateNewFolderModel;
