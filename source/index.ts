import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';

import EasyImagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
import ImageCaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUploadPlugin from '@ckeditor/ckeditor5-image/src/imageupload';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

type CraftInterface = {
  deltaNames: string[];
  language: string;
};

declare global {
  interface Window {
    Craft: CraftInterface;
  }
}

const blocks = ['genericRichText'];

const getCheckNumber = ({ attempt = 0 }) => attempt + 1;
const getLoadTimer = ({ timer = 0 }) => timer + 500;
const isWindowLoaded = ({ amount }: { amount: number }) => {
  const list = Array.from(document.querySelectorAll(`[name*="fields"`)).filter(
    (element) => {
      return element.getAttribute('type') !== 'hidden';
    },
  ) as Array<HTMLElement>;

  return list.length >= amount;
};
const getPermissionLevel = async () => {
  const element = document.querySelector(
    '[name="CRAFT_CSRF_TOKEN"]',
  ) as HTMLInputElement;

  if (element) {
    const value = element.getAttribute('value');
    if (value) {
      const formData = new FormData();
      formData.append('CRAFT_CSRF_TOKEN', value);

      const response = await fetch('/api/user', {
        body: formData,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const isSuperUser = await response.json();

      return isSuperUser;
    }
  }

  return false;
};

const getPlugins = () => {
  const items = [
    SimpleUploadAdapter,
    Essentials,
    Paragraph,
    ParagraphButtonUI,
    Link,
    List,
    Bold,
    Italic,
    HeadingPlugin,
    ImagePlugin,
    ImageCaptionPlugin,
    ImageStylePlugin,
    ImageToolbarPlugin,
    ImageUploadPlugin,
    HtmlEmbed,
  ];

  return items;
};

const getToolbar = ({ isAdmin }: { isAdmin: boolean }) => {
  const items = [
    'heading',
    '|',
    'alignment',
    '|',
    'bold',
    'italic',
    'strikethrough',
    'underline',
    'subscript',
    'superscript',
    '|',
    'uploadImage',
    '|',
    'link',
    '|',
    'bulletedList',
    'numberedList',
  ];

  if (isAdmin) {
    items.unshift('htmlEmbed', '|');
  }

  return {
    items,
    shouldNotGroupWhenFull: false,
  };
};

const setEditors = ({ isAdmin }: { isAdmin: boolean }) => {
  blocks.forEach((block: string) => {
    const editors = Array.from(
      document.querySelectorAll(`textarea[name*="${block}"]`),
    ) as Array<HTMLTextAreaElement>;
    const plugins = getPlugins();
    const toolbar = getToolbar({ isAdmin });

    editors.forEach(async (editor) => {
      if (editor) {
        await ClassicEditor.create(editor, {
          plugins,
          toolbar,
        });
      }
    });
  });
};

window.addEventListener('load', async () => {
  const craft = window.Craft;

  console.log(craft);

  // is this set on window.craft?

  // const isAdmin = await getPermissionLevel();
  const isAdmin = true;

  // Would love to add an observer event rather than applying this guess.  Ideally a callback function on window.craft.

  const loadChecker = (timer: number, attempt?: number) => {
    setTimeout(() => {
      const isLoaded = isWindowLoaded({ amount: craft.deltaNames.length });

      if (isLoaded) {
        setEditors({ isAdmin });
        return;
      }

      getCheckNumber({ attempt });
      loadChecker(getLoadTimer({ timer }), attempt);
    }, timer);
  };

  loadChecker(0);
});

export {};
