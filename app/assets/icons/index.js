
import { Icon } from './icon.component';
export {
  Icon,
  IconSource,
  RemoteIcon,
} from './icon.component';

export const IconDelete = (style) => {
  const source = {
    imageSource: require('./eva/trash.png'),
  };

  return Icon(source, style);
};

export const IconClose = (style) => {
  const source = {
    imageSource: require('./eva/close.png'),
  };

  return Icon(source, style);
};

export const IconTrash = (style) => {
  const source = {
    imageSource: require('./other/trash.png'),
  };

  return Icon(source, style);
};

export const IconWork = (style) => {
  const source = {
    imageSource: require('./eva/portfolio.png'),
  };

  return Icon(source, style);
};

export const IconCalendar = (style) => {
  const source = {
    imageSource: require('./other/calendar.png'),
  };

  return Icon(source, style);
};

export const IconNote = (style) => {
  const source = {
    imageSource: require('./other/notes.png'),
  };

  return Icon(source, style);
};

export const IconCheck = (style) => {
  const source = {
    imageSource: require('./eva/checked.png'),
  };

  return Icon(source, style);
};