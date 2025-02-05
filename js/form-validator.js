import { PHOTO_CONSTS } from './const.js';

const { MAX_COMMENT_SYBMOLS, MAX_SYMBOLS, MAX_HASHTAGS } = PHOTO_CONSTS;

const uploadForm = document.querySelector('.img-upload__form');
const body = document.querySelector('body');
const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'pristine-error',
});

// Правила валидации хэштегов
const hashtagRules = [
  {
    check: (inputArray) => inputArray.every((item) => item !== '#'),
    error: 'Хэштег не может состоять только из одной решётки',
  },
  {
    check: (inputArray) => inputArray.every((item) => !item.slice(1).includes('#')),
    error: 'Хэштеги разделяются пробелами',
  },
  {
    check: (inputArray) => inputArray.every((item) => item[0] === '#'),
    error: 'Хэштег должен начинаться с символа "#"',
  },
  {
    check: (inputArray) => inputArray.every((item, index, array) => array.indexOf(item) === index),
    error: 'Хэштеги не должны повторяться',
  },
  {
    check: (inputArray) => inputArray.every((item) => item.length <= MAX_COMMENT_SYBMOLS),
    error: `Максимальная длина одного хэштега ${MAX_SYMBOLS} символов, включая решётку`,
  },
  {
    check: (inputArray) => inputArray.length <= MAX_HASHTAGS,
    error: `Нельзя указать больше ${MAX_HASHTAGS} хэштегов`,
  },
];

// Функция валидации хэштегов
const validateHashtags = (value) => {
  if (!value.trim()) {
    return true; // Пустое значение валидно
  }
  const inputArray = value.trim().toLowerCase().split(/\s+/);
  return hashtagRules.every((rule) => rule.check(inputArray));
};

// Функция получения текста ошибки
const getHashtagsError = (value) => {
  if (!value.trim()) {
    return '';
  }
  const inputArray = value.trim().toLowerCase().split(/\s+/);
  for (const rule of hashtagRules) {
    if (!rule.check(inputArray)) {
      return rule.error;
    }
  }
  return '';
};

// Правило для валидации комментария
const validateDescription = (value) => value.length <= MAX_COMMENT_SYBMOLS;
const getDescriptionError = () =>
  `Длина комментария не может превышать ${MAX_COMMENT_SYBMOLS} символов.`;
pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsError);
pristine.addValidator(descriptionInput, validateDescription, getDescriptionError);
const openEditForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  closeButton.addEventListener('click', closeEditForm);
  document.addEventListener('keydown', onEscKeyPress);
};

// Закрытие формы редактирования
function closeEditForm() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadForm.reset();
  pristine.reset();
  closeButton.removeEventListener('click', closeEditForm);
  document.removeEventListener('keydown', onEscKeyPress);
}

// Закрытие формы при нажатии Escape
function onEscKeyPress(evt) {
  if (evt.key === 'Escape' &&
    !hashtagsInput.matches(':focus') &&
    !descriptionInput.matches(':focus')) {
    evt.preventDefault();
    closeEditForm();
  }
}

// Отключение обработки Escape при фокусе на полях ввода
[hashtagsInput, descriptionInput].forEach((input) => {
  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  });
});

// Открытие формы при выборе файла
uploadInput.addEventListener('change', () => {
  openEditForm();
});

// Обработчик отправки формы
uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    uploadForm.submit();
  }
});
