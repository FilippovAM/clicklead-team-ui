export default {

  follow: (name, target) => {
    if(!window.EventsList) window.EventsList = {}
    window.EventsList[name] = true
    window.addEventListener(name, target)
  },

  unfollow: (name, target) => {
    if(window.EventsList && window.EventsList[name]) delete window.EventsList[name]
    window.removeEventListener(name, target)
  },

  list: () => window.EventsList && Object.keys(window.EventsList).map(key => key) || [],
  
  dispatch: (name) => window.dispatchEvent(new Event(name)),
}
