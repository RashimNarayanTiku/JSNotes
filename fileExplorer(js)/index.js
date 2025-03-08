const data = {
  "*": {
    '1': {
      name: 'file1.txt',
      parentId: "*"
    },
    '2': {
      name: 'folder1',
      children: ['3', '4'],
      parentId: "*",
      isExpanded: true
    },
    '3': {
      name: 'file3.js',
      parentId: '2'
    },
    '4': {
      name: 'folder2',
      children: [],
      parentId: '2',
      isExpanded: true
    }
  },
  "children": ['1', '2']
}

// Better to do with CSS, since isExpanded data isn't required.
// And it renders everything again which is useless.

// Consider this approach
function toggleExpandFolder(id) {
  const obj = data['*'][id];
  obj.isExpanded = !obj.isExpanded;
  
  const folderElement = document.getElementById(id);
  const childContainer = folderElement.querySelector('.child-element-container');
  
  if (obj.isExpanded) {
    render(childContainer, obj.children);
  } else {
    childContainer.innerHTML = '';
  }
}

// Didn't handle the case when no folder is present.
// So we cant add new file/folder in this case.
function createInput(container, isFolder) {
  if(container.firstChild && container.firstChild.classList.contains('create-input-container')) return;

  const parentId = container.dataset.parentId;
  function createNew() {
    const id = `${Date.now()}-${Math.random()}`
    data['*'][id] = {
      name: addFileInputContainer.firstChild.value,
      parentId
    }
    if(isFolder) {
      data['*'][id] = {
        name: addFileInputContainer.firstChild.value,
        isExpanded: true,
        children:[],
        parentId
      }
    }
    data['*'][parentId]["children"].push(id)
  
    container.removeChild(container.firstChild);
    if(data['*'][parentId].isExpanded) {
      const newElement = isFolder ? renderFolder(id) : renderFile(id);    
      container.appendChild(newElement);
    }
  }

  const addFileInputContainer = document.createElement('div');
  addFileInputContainer.classList.add('create-input-container')
  addFileInputContainer.innerHTML = `<input />`
  const submitBtn = document.createElement('button');
  submitBtn.innerText = 'Submit';
  submitBtn.id =`create-input-submit-btn-${parentId}`
  submitBtn.addEventListener('click', createNew);
  addFileInputContainer.appendChild(submitBtn);
  container.insertBefore(addFileInputContainer, container.firstChild);
}

function renderFolder(id) {
  const obj = data["*"][id];
  const element = document.createElement("div");
  element.classList.add("folder");
  element.id = id;
  element.innerHTML = `
    <div class="folder-title" style="background-color:alice; border-bottom:1px solid black">
      <span>${obj.name}</span>
      <div class="create-new">
        <button class="create-new__file">Add File</button>
        <button class="create-new__folder">Add Folder</button>
      </div>
    </div>
  `;
  
  element.querySelector(".create-new__file").addEventListener("click", function (event) {
    event.stopPropagation();
    createInput(element.getElementsByClassName('child-element-container')[0], false);
  });
  element.querySelector(".create-new__folder").addEventListener("click", function (event) {
    event.stopPropagation();
    createInput(element.getElementsByClassName('child-element-container')[0], true);
  });
  
  const childElementContainer = document.createElement('div');
  childElementContainer.classList.add('child-element-container')
  childElementContainer.dataset.parentId = id;
  childElementContainer.style.paddingLeft = '10px';

  if(obj.isExpanded) {
    render(childElementContainer, obj.children);
  }
  
  element.appendChild(childElementContainer);

  const folderTitle = element.children[0];
  folderTitle.addEventListener('click', () => toggleExpandFolder(id));
  return element;
}

function renderFile(id) {
  const obj = data["*"][id];
  const element = document.createElement('div');
  element.classList.add('file')
  element.id = id;
  element.innerHTML = '<span style="background-color:white">' + obj.name + '</span>';
  return element;
}

function render(container, idList) {
  container = container ?? document.getElementById('file_explorer');
  idList = idList ?? data['children'];

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  idList.map((id) => {
    const obj = data['*'][id];
    const isFolder = 'children' in obj;
    if(isFolder) {
      const folderElement = renderFolder(id);
      fragment.appendChild(folderElement);
    } else {
      const fileElement = renderFile(id);
      fragment.appendChild(fileElement);
    }
  });

  container.appendChild(fragment);
}

render();
