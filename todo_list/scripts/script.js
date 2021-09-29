// functions for working with elements

function addMultiplesEvents(element, eventsName, listener) {
  const events = eventsName.split(' ');

  events.forEach((event) => {
    element.addEventListener(event, listener, false);
  });
}

function addMultiplesListeners(arr, eventName, listener) {
  arr.forEach((element) => {
    element.addEventListener(eventName, listener, false);
  });
}

function addMultiplesEventsAndListeners(arr, eventsName, listener) {
  const events = eventsName.split(' ');

  arr.forEach((element) => {
    events.forEach((event) => {
      element.addEventListener(event, listener, false);
    });
  });
}

// global variables

const user = {
  taskContent: '',
  allTasks: [],
  configMenu: false,
};

const staticElements = {
  inputTextTask: document.querySelector('#texto-tarefa'),
  taskList: document.querySelector('#lista-tarefas'),
  buttonCreateTask: document.querySelector('#criar-tarefa'),
  buttonDeleteAll: document.querySelector('#apaga-tudo'),
  buttonDeleteDone: document.querySelector('#remover-finalizados'),
  buttonDeleteSelected: document.querySelector('#remover-selecionado'),
  buttonSave: document.querySelector('#salvar-tarefas'),
  generalConfigs: document.querySelector('#general-configs-container'),
  secondaryMenu: document.querySelector('#mouse-2-menu'),
};

// functions for the project

function resetTaskSelection() {
  user.allTasks.forEach((task) => {
    task.content.classList.remove('selected');
  });
}

function selectTask(event) {
  resetTaskSelection();
  event.target.classList.add('selected');
}

function completeTask(event) {
  event.target.classList.toggle('completed');
}

function taskEvents(event) {
  if (event.type !== 'dblclick') {
    selectTask(event);
  } else {
    completeTask(event);
  }
}

function lintenTaskItem() {
  const allTasks = document.querySelectorAll('.task-item');
  if (allTasks.length > 0) {
    addMultiplesEventsAndListeners(allTasks, 'click dblclick', taskEvents);
  }
}

function getTaskContent(event) {
  if (event.which === 13) {
    taskCreation();
    // saveLocalStorage();
  } else {
    user.taskContent = event.target.value;
  }
}

function taskListInput() {
  staticElements.inputTextTask.addEventListener('keyup', getTaskContent);
}

function constructorTask(taskContainer, taskContent, ...taskSubContent) {
  if (taskSubContent.length !== 0) {
    return {container: taskContainer, content: taskContent, subContent: taskSubContent};
  }
  return {container: taskContainer, content: taskContent}
}

function saveTask(taskObj) {
  user.allTasks.push(taskObj);
}

function createTaskContent() {
  const newTaskContent = document.createElement('h3');
  newTaskContent.classList.add('task-title');
  newTaskContent.innerText = user.taskContent;
  return newTaskContent;
}

// function createTaskSubContent() {

// }

function createTaskContainer() {
  const newTaskConatiner = document.createElement('li');
  newTaskConatiner.classList.add('task-item');
  return newTaskConatiner;
}

function createTask() {
  const taskContainer = createTaskContainer();
  const taskContent = createTaskContent();
  // const taskSubContent = createTaskSubContent();
  taskContainer.appendChild(taskContent);
  saveTask(constructorTask(taskContainer, taskContent));
}

function resetTaskList() {
  user.allTasks.forEach((task) => {
    task.container.remove();
  });
}

function resetAllTasks() {
  user.allTasks.length = 0;
}

function renderTask() {
  user.allTasks.forEach((task) => {
    staticElements.taskList.appendChild(task.container);
  });
  lintenTaskItem();
}

function resetInput() {
  staticElements.inputTextTask.value = '';
  user.taskContent = '';
}

function taskCreation() {
  createTask();
  resetInput();
  resetTaskList();
  renderTask();
}

function deleteAllTasks() {
  resetTaskList();
  resetAllTasks();
  renderTask();
}

function saveTaskClassPosition(className) {
  let taskClassPosition = '';

  user.allTasks.forEach((task) => {
    const taskClass = task.content.classList.toString();
    if (taskClass.includes(className)) {
      taskClassPosition = user.allTasks.indexOf(task);
    }
  });

  return taskClassPosition;
}

function deleteClassBased(className) {
  const removeIndex = saveTaskClassPosition(className);
  if (user.allTasks[removeIndex] !== undefined) {
    user.allTasks[removeIndex].container.remove();
    user.allTasks.splice(removeIndex, 1);
  }
}

function deleteDoneTasks() {
  for (let i = user.allTasks.length; i >= 0; i -= 1) {
    deleteClassBased('completed');
  }
}

function deleteSelectedTask() {
  deleteClassBased('selected');
}

function moveUp() {
  const initialPos = saveTaskClassPosition('selected');
  const tempArr = [...user.allTasks];

  if (initialPos > 0 && initialPos !== '') {
    [user.allTasks[initialPos]] = [tempArr[initialPos - 1]];
    [user.allTasks[initialPos - 1]] = [tempArr[initialPos]];
    renderTask();
  }
}

function moveDown() {
  const initialPos = saveTaskClassPosition('selected');
  const tempArr = [...user.allTasks];

  if (initialPos < user.allTasks.length - 1 && initialPos !== '') {
    [user.allTasks[initialPos]] = [tempArr[initialPos + 1]];
    [user.allTasks[initialPos + 1]] = [tempArr[initialPos]];
    renderTask();
  }
}

// function stringifyTasks(arr) {
//   const tempArr = [];
//   arr.forEach((e) => {
//     tempArr.push(JSON.stringify(e.outerHTML));
//   });
//   return tempArr;
// }

// function getAllTasks() {
//   const taskContainer = stringifyTasks(document.querySelectorAll('.task-item'));
//   const taskContent = stringifyTasks(document.querySelectorAll('.task-title'));
//   return [taskContainer, taskContent];
// }

// function saveLocalStorage() {
//   localStorage.setItem('task-container', getAllTasks()[0]);
//   localStorage.setItem('task-content', getAllTasks()[1]);
// }

// function renderSaveTasks() {
//   const storageTasks = localStorage.getItem('task-container');
//   const storageTasksTitle = localStorage.getItem('task-content')

//   console.log(JSON.parse(storageTasksTitle));

//   if (storageTasks !== null) {
//     staticElements.taskList.innerHTML = storageTasks;
  
//     console.log(storageTasksTitle);
//   }


//   document.querySelectorAll('.task-item').forEach((task) => {
//     saveTask(task);
//   });
// }

const buttonsListeners = {
  criar_tarefa: taskCreation,
  apaga_tudo: deleteAllTasks,
  remover_finalizados: deleteDoneTasks,
  remover_selecionado: deleteSelectedTask,
  // create_subtasks: createSubTasks,
  remove_done_task: deleteDoneTasks,
  // unselect_task: unSelectTask,
  // change_bgc_task: changeBgcTask,
  // save_all_task: saveLocalStorage,
};

function execButton(event) {
  const rightFunc = buttonsListeners[event.target.id];
  rightFunc();
  // saveLocalStorage();
}

const keyListeners = {
  ArrowUp: moveUp,
  ArrowDown: moveDown,
  Delete: deleteSelectedTask,
}

function keyCommands(event) {
  const rightCommand = keyListeners[event.key];
  if (rightCommand) {
    rightCommand();
    // saveLocalStorage();
  }
}

function hideSecondaryMenu() {
  collapseSecondayMenu();
  setTimeout(() => staticElements.secondaryMenu.style.display = 'none', 290);
}

function showSecondayMenu() {
  staticElements.secondaryMenu.style.display = 'block';
  expandSecondayMenu();
}

function mouseCommands(event) {
  event.preventDefault();
  staticElements.secondaryMenu.style.left = `${event.clientX}px`;
  staticElements.secondaryMenu.style.top = `${event.clientY - 5}px`;
  showSecondayMenu();
}

function execUniversalCommands(event) {
  const whatCommand = event.type === 'keyup'
  ? keyCommands
  : mouseCommands;
  whatCommand(event);
}

// Animation

function showMenu() {
  const show = anime({
    targets: '#general-configs-container',
    translateX: 166,
    easing: 'linear',
    duration: 300,
    autoplay: false,
  });

  show.play();
}

function hideMenu() {
  const hide = anime({
    targets: '#general-configs-container',
    translateX: 0,
    easing: 'linear',
    duration: 300,
    autoplay: false,
  });

  hide.play();
}

function triggerMenuControl(event) {
  if (event.target === staticElements.generalConfigs && !user.configMenu) {
    user.configMenu = true;
    showMenu();
  } else if (event.target === staticElements.generalConfigs && user.configMenu) {
    user.configMenu = false;
    hideMenu();
  }
};

function activeBtnHover(element, initColor) {
  const activeHover = anime({
    targets: element,
    backgroundColor: [initColor, '#4f0a99'],
    color: [initColor, '#F8F9FA'],
    autoplay: false,
    duration: 500,
    easing: 'easeInOutSine',
  });

  activeHover.play();
}

function restartBtnHover(element, initColor) {
  const restartHover = anime({
    targets: element,
    backgroundColor: [initColor, '#39C18C'],
    color: [initColor, '#212529'],
    autoplay: false,
    duration: 500,
    easing: 'easeInOutSine',
  });

  restartHover.play();
}

function triggerBtnColors(event) {
  if (event.type === 'mouseenter') {
    activeBtnHover(event.target, event.target.style.backgroundColor);
  } else if (event.type === 'mouseleave') {
    restartBtnHover(event.target, event.target.style.backgroundColor);
  }
}

function expandSecondayMenu() {
  const secondaryMenu = anime({
    targets: '#mouse-2-menu .secondary-menu-container',
    height: ['5px', '270px'],
    width: ['5px', '195px'],
    autoplay: false,
    duration: 300,
    easing: 'easeInOutSine',
  });

  secondaryMenu.play();
}

function collapseSecondayMenu() {
  const secondaryMenu = anime({
    targets: '#mouse-2-menu .secondary-menu-container',
    height: ['270px', '5px'],
    width: ['195px', '5px'],
    autoplay: false,
    duration: 300,
    easing: 'easeInOutSine',
  });

  secondaryMenu.play();
}
 
window.onload = () => {
  taskListInput();
  staticElements.generalConfigs.addEventListener('click', triggerMenuControl);
  staticElements.secondaryMenu.addEventListener('mouseleave', hideSecondaryMenu);
  addMultiplesEventsAndListeners(document.querySelectorAll('.btn-config'), 'mouseenter mouseleave', triggerBtnColors);
  addMultiplesEvents(document, 'keyup contextmenu', execUniversalCommands);
  addMultiplesListeners(document.querySelectorAll('button'), 'click', execButton);
  // renderSaveTasks();
  lintenTaskItem();
};
