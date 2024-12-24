async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);
  const result = await studentActivitiesRegistration(argv);

  return result;
}

async function getStudentActivities() {
  try {
    const response = await fetch("http://localhost:3001/activities");
    const activities = await response.json();
    return activities;
  } catch (error) {
    console.error("Error fetching student activities:", error);
    return [];
  }
}

async function studentActivitiesRegistration(data) {
  const method = data[0];
  try {
    if (method === "CREATE") {
      const name = data[1];
      const day = data[2];
      const activitiesResponse = await fetch(
        "http://localhost:3001/activities"
      );
      const activities = await activitiesResponse.json();

      const studentActivities = activities.filter((activity) =>
        activity.days.includes(day)
      );

      const newStudent = {
        name: name,
        activities: studentActivities.map(({ name, desc }) => ({
          name,
          desc,
        })),
      };

      console.log("New student to register:", newStudent);

      const studentResponse = await fetch("http://localhost:3001/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (studentResponse.ok === false) {
        let errorText;
        try {
          errorText = await studentResponse.json();
        } catch (err) {
          errorText = await studentResponse.text();
        }
        console.error("Response error:", errorText);
        throw new Error("Failed to register student");
      }

      const studentData = await studentResponse.json();
      return studentData;
    } else if (method === "DELETE") {
      const studentId = data[1];

      const deleteResponse = await fetch(
        `http://localhost:3001/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteResponse.ok === false) {
        let errorText;
        try {
          errorText = await deleteResponse.json();
        } catch (err) {
          errorText = await deleteResponse.text();
        }
        console.error("Delete response error:", errorText);
        throw new Error("Failed to delete student");
      }

      const result = await deleteResponse.json();
      return result;
    }
  } catch (error) {
    console.error("Error in studentActivitiesRegistration:", error);
    throw error;
  }
}

async function addStudent(name, day) {
  try {
    const activitiesResponse = await fetch("http://localhost:3001/activities");
    const activities = await activitiesResponse.json();

    const studentActivities = activities.filter((activity) =>
      activity.days.includes(day)
    );

    const newStudent = {
      name: name,
      activities: studentActivities.map(({ name, desc }) => ({
        name,
        desc,
      })),
    };

    console.log("New student to add:", newStudent);

    const studentResponse = await fetch("http://localhost:3001/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    });

    if (studentResponse.ok === false) {
      let errorText;
      try {
        errorText = await studentResponse.json();
      } catch (err) {
        errorText = await studentResponse.text();
      }
      console.error("Response error:", errorText);
      throw new Error("Failed to add student");
    }

    const studentData = await studentResponse.json();
    return studentData;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

async function deleteStudent(id) {
  try {
    const deleteResponse = await fetch(`http://localhost:3001/students/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteResponse.ok === false) {
      let errorText;
      try {
        errorText = await deleteResponse.json();
      } catch (err) {
        errorText = await deleteResponse.text();
      }
      console.error("Error deleting student:", errorText);
      throw new Error("Failed to delete student");
    }

    const result = await deleteResponse.json();
    return result;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

process_argv()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  studentActivitiesRegistration,
  getStudentActivities,
  addStudent,
  deleteStudent,
};
