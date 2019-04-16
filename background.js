whale.commands.onCommand.addListener((command) => {
  if (command === 'open-sidebar') {
    whale.sidebarAction.show();
  }
});