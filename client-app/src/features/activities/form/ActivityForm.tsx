import React, { FormEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import {v4 as uuid} from 'uuid';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity; //initial form state
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  submitting: boolean;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState, //initialFormState is activity, do this to prevent duplicated error
  createActivity,
  editActivity,
  submitting
}) => {
  const initializeForm = () => {
    if (initialFormState) return initialFormState;
    else
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  //when we set value to an input field
  //REACT sets the field to readonly
  //therefore we need a function to handle input
  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else editActivity(activity);
  };

  return (
    <Segment clearing style={{position: 'fixed'}}>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          placeholder="Description"
          value={activity.description}
          onChange={handleInputChange}
          name="description"
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          onChange={handleInputChange}
          name="category"
        />
        <Form.Input
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
          onChange={handleInputChange}
          name="date"
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          onChange={handleInputChange}
          name="city"
        />
        <Form.Input
          placeholder="Venue"
          value={activity.venue}
          onChange={handleInputChange}
          name="venue"
        />
        <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
