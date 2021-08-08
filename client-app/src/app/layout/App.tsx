import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

/*convert to ReactHook
remove class
remove IState
import {userState}
componentDidMount => useEffect
*/

const App = () => {
  //state is activities
  //setState => setActivities
  //pass type IActivity[] into useState
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    //find the activity that has the id, set it to state selectedActivity
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    //close the form if it is showing
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    //spread the activities into an array, then add the new activity into the array
    setActivities([...activities, activity]);
    //display the new activity
    setSelectedActivity(activity);
    //close the form
    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    //spread all activities that does not have the same id as the selected activity
    //into an array, then add the edited one into the array
    setActivities([
      ...activities.filter((a) => a.id !== activity.id),
      activity,
    ]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) =>{
    //set actitivities to the ones that the not have the deleted id
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  useEffect(() => {
    //connect to the api, values controller using GET method
    //returns a response object
    //set data from response to state (like AJAX)
    //returned response is of type IActivity[]
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        let activities: IActivity[] = [];
        response.data.forEach((activity) => {
          //after get the date from the API
          //split and get the first part of the date
          //so that we can assign the date value
          //into the form component
          activity.date = activity.date.split(".")[0];
          activities.push(activity);
        });
        //set what is rendered on the page, may cause re-rendering
        setActivities(activities);
      });
  }, []); //pass the second parameter an empty to prevent the method running multiple times

  //Fragment: allows returning multiple elements
  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
