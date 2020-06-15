import React, { useState, Button } from "react";
import { useQuery, useSubscription, useMutation } from "graphql-hooks";

const TOPIC_SUBSCRIPTION = `
    subscription MySubscription {
    topics {
      id
      name
    }
  }
  `;

const SIMPLE_QUERY = `query MyQuery {
    users {
      access_token
      email
      github_user_id
    }
  }
  `;
export const Hasura = () => {
  const handleSubscription = ({ data, errors }) => {
    if (errors && errors.length > 0) {
      console.log(errors[0]);
    }
    if (data) {
      // setVote(voteAdded)
      console.log(data);
    }
  };
  useSubscription(
    {
      query: TOPIC_SUBSCRIPTION,
    },
    handleSubscription
  );

  const { loading, error, data } = useQuery(SIMPLE_QUERY);
  if (loading) return <p>Loading..</p>;
  if (error) return "Something Happened";

  return <div>{JSON.stringify(data)}</div>;
};
