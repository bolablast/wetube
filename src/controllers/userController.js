import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account" });
export const postJoin = async (req, res) => {
  const {
    body: { name, username, email, password, password2, location },
  } = req;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (item) => item.primary === true && item.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", {
    pageTitle: "Edit Profile",
  });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  const exsitsUsername = await User.exists({ username });
  const exsitsEmail = await User.exists({ email });
  if (
    req.session.user.username == username &&
    req.session.user.email == email
  ) {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        location,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    console.log("no change");
    return res.redirect("/users/edit");
  } else if (
    req.session.user.username !== username &&
    req.session.user.email == email
  ) {
    if (!exsitsUsername) {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          name,
          username,
          location,
        },
        { new: true }
      );
      console.log("username true");
      req.session.user = updatedUser;
      return res.redirect("/users/edit");
    } else {
      console.log("username false");
      return res.render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "The username is already taken",
      });
    }
  } else if (
    req.session.user.email !== email &&
    req.session.user.username == username
  ) {
    if (!exsitsEmail) {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          name,
          email,
          location,
        },
        { new: true }
      );
      console.log("email true");
      req.session.user = updatedUser;
      return res.redirect("/users/edit");
    } else {
      console.log("email false");
      return res.render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "The email is already taken",
      });
    }
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        username,
        location,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    console.log("all change");
    return res.redirect("/users/edit");
  }
};
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = (req, res) => {
  // send notification
  return res.redirect("/");
};
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = (req, res) => res.send("See User");
