import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";
import { SyntheticEvent } from "react";

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmiting] = useState(false);
  const [target, setTarget] = useState(''); //button that being clicked

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
    setSubmiting(true);
    //call create from agent
    //agent sends request to API to add the activity in Database
    //after that, handle data on the client side
    agent.Activities.create(activity).then(() => {
      //spread the activities into an array, then add the new activity into the array
      setActivities([...activities, activity]);
      //display the new activity
      setSelectedActivity(activity);
      //close the form
      setEditMode(false);
    }).then(() => setSubmiting(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmiting(true);
    agent.Activities.update(activity).then(() => {
      //spread all activities that does not have the same id as the selected activity
      //into an array, then add the edited one into the array
      setActivities([
        ...activities.filter((a) => a.id !== activity.id),
        activity,
      ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmiting(false));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmiting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      //set actitivities to the ones that the not have the deleted id
      setActivities([...activities.filter((a) => a.id !== id)]);
    }).then(() => setSubmiting(false));
  };

  useEffect(() => {
    //connect to the api, values controller using GET method
    //returns a response object
    //set data from response to state (like AJAX)
    //returned response is of type IActivity[]
    agent.Activities.list().then((response) => {
      let activities: IActivity[] = [];
      response.forEach((activity) => {
        //after getting the date from the API
        //split and get the first part of the date
        //so that we can assign the date value
        //into the form component
        activity.date = activity.date.split(".")[0];
        activities.push(activity);
      });
      //set what is rendered on the page, may cause re-rendering
      setActivities(activities);
    }).then(() => setLoading(false)); //after setting activities, close the loading component
  }, []); //pass the second parameter an empty to prevent the method running multiple times

  //if loading state is true, render the loading component
  if(loading) return <LoadingComponent content='Loading activities...' />

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
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
