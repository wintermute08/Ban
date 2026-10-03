(() => {
  'use strict';

  const form = document.querySelector('#verification-form');
  const nameInput = document.querySelector('#full-name');
  const birthInput = document.querySelector('#resident-birth');
  const residentDigit = document.querySelector('#resident-digit');
  const phoneInput = document.querySelector('#phone-number');
  const countdown = document.querySelector('#countdown');
  const timerHelp = document.querySelector('#timer-help');
  const message = document.querySelector('#form-message');
  const durationSeconds = 176;
  let expiresAt = Date.now() + durationSeconds * 1000;
  let expired = false;

  const digitsOnly = (value) => value.replace(/\D/g, '');

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.hidden = false;
    message.classList.toggle('is-error', isError);
  }

  function markInvalid(input, text) {
    input.setAttribute('aria-invalid', 'true');
    showMessage(text, true);
    input.focus();
    return false;
  }

  function clearErrors() {
    [nameInput, phoneInput, birthInput, residentDigit].forEach((input) => input.removeAttribute('aria-invalid'));
  }

  function identityIsValid() {
    if (nameInput.value.trim().length < 2) {
      return markInvalid(nameInput, '이름을 2자 이상 입력해 주세요.');
    }
    if (!/^\d{6}$/.test(birthInput.value)) return markInvalid(birthInput, '주민등록번호 앞 6자리를 입력해 주세요.');
    if (!/^[0-9]$/.test(residentDigit.value)) return markInvalid(residentDigit, '주민등록번호 뒤 첫 1자리를 입력해 주세요.');
    if (!/^(?:010\d{8}|01[16789]\d{7,8})$/.test(digitsOnly(phoneInput.value))) {
      return markInvalid(phoneInput, '휴대폰 번호를 확인해 주세요. 예: 010-1234-5678');
    }
    return true;
  }

  function tick() {
    const secondsLeft = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    countdown.textContent = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;
    countdown.classList.toggle('is-expired', secondsLeft === 0);
    if (secondsLeft === 0 && !expired) {
      expired = true;
      timerHelp.textContent = '입력 시간이 만료되었습니다. 재요청해 주세요.';
      showMessage('입력 시간이 만료되었습니다. 재요청 버튼으로 다시 시작해 주세요.', true);
    }
  }

  birthInput.addEventListener('input', () => {
    birthInput.value = digitsOnly(birthInput.value).slice(0, 6);
  });
  residentDigit.addEventListener('input', () => {
    residentDigit.value = digitsOnly(residentDigit.value).slice(0, 1);
  });
  birthInput.addEventListener('paste', (event) => {
    const digits = digitsOnly(event.clipboardData.getData('text'));
    if (digits.length >= 7) {
      event.preventDefault();
      birthInput.value = digits.slice(0, 6);
      residentDigit.value = digits.slice(6, 7);
      birthInput.dispatchEvent(new Event('input'));
      residentDigit.dispatchEvent(new Event('input'));
      residentDigit.focus();
    }
  });

  // Format on blur so edits in the middle of a phone number remain predictable.
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^\d-]/g, '').slice(0, 13);
  });
  phoneInput.addEventListener('blur', () => {
    const digits = digitsOnly(phoneInput.value);
    if (digits.length === 11) phoneInput.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    if (digits.length === 10) phoneInput.value = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  });

  [nameInput, phoneInput, birthInput, residentDigit].forEach((input) => {
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      if (message.classList.contains('is-error')) message.hidden = true;
    });
  });

  document.querySelector('#resend-button').addEventListener('click', () => {
    clearErrors();
    if (!identityIsValid()) return;
    expiresAt = Date.now() + durationSeconds * 1000;
    expired = false;
    timerHelp.textContent = '남은 시간 안에 인증번호를 입력해 주세요.';
    tick();
    showMessage('인증번호 입력 시간이 초기화되었습니다.');
  });

  document.querySelector('#certificate-button').addEventListener('click', () => {
    clearErrors();
    showMessage('인증서 본인인증은 서비스 연결 후 이용할 수 있습니다. 현재 화면에서는 실제 인증이 진행되지 않습니다.');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    if (!identityIsValid()) return;
    tick();
    if (expired) {
      showMessage('입력 시간이 만료되었습니다. 재요청 버튼을 눌러 주세요.', true);
      document.querySelector('#resend-button').focus();
      return;
    }
    showMessage('입력 형식을 확인했습니다. 실제 본인인증 완료 여부는 인증 서비스 연결 후 확인할 수 있습니다.');
  });

  document.addEventListener('visibilitychange', tick);
  // Match the visible viewport when the mobile keyboard opens.
  function fitViewport() {
    document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport?.height || window.innerHeight}px`);
  }
  window.visualViewport?.addEventListener('resize', fitViewport);
  window.addEventListener('resize', fitViewport);
  fitViewport();
  tick();
  window.setInterval(tick, 250);
})();
