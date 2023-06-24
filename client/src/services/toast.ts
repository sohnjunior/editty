import { EventBus, EVENT_KEY } from '@/event-bus'

const TOAST_MESSAGE = {
  ADD_ARCHIVE: {
    SUCCESS: {
      variant: 'success',
      title: '',
      description: '추가되었습니다.',
    },
    FAIL: {
      variant: 'fail',
      title: '',
      description: '잠시 후에 다시 시도해주세요.',
    },
  },
  SAVE_ARCHIVE: {
    SUCCESS: {
      variant: 'success',
      title: '',
      description: '저장되었습니다.',
    },
    FAIL: {
      variant: 'fail',
      title: '',
      description: '잠시 후에 다시 시도해주세요.',
    },
  },
  DELETE_ARCHIVE: {
    SUCCESS: {
      variant: 'success',
      title: '',
      description: '삭제되었습니다.',
    },
    FAIL: {
      variant: 'fail',
      title: '',
      description: '잠시 후에 다시 시도해주세요.',
    },
  },
  DOWNLOAD: {
    SUCCESS: {
      variant: 'success',
      title: '',
      description: '다운로드에 성공했습니다.',
    },
    FAIL: {
      variant: 'fail',
      title: '',
      description: '다운로드에 실패했습니다.',
    },
  },
}

export function showToast(category: keyof typeof TOAST_MESSAGE, type: 'SUCCESS' | 'FAIL') {
  const { variant, title, description } = TOAST_MESSAGE[category][type]
  EventBus.getInstance().emit(EVENT_KEY.SHOW_TOAST, variant, title, description)
}
