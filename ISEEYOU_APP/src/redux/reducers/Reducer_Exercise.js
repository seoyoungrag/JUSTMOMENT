import types from "../actions/Types_Exercise";

//운동목표선택데이터 DB랑 동일한 값 유지한다.
const exerciseGoalCd = [];
//운동요일은 코드값을 사용하지 않는다. 0,1,2,3,4,5,6(일월화수목금토)
const exerciseDay = [];
//운동범위데이터 DB랑 동일한 값 유지한다.
const exerciseRange = [];
const exerciseInfo = [];
const wiseSaying = [
  {
    idx: 1,
    text: "아이에게 해주면 좋은말\n1.엄마는 정말 너를 사랑 한단다"
  },
  {
    idx: 2,
    text: "아이에게 해주면 좋은말\n2.틀려도 괜찮아"
  },
  {
    idx: 3,
    text:
      "아이에게 해주면 좋은말\n3.네가 정말 열심히 했으면 그것으로 충분한거야"
  },
  {
    idx: 4,
    text: "아이에게 해주면 좋은말\n4.넌 잘할 수 있어"
  },
  {
    idx: 5,
    text: "아이에게 해주면 좋은말\n5.엄마에게 뽀뽀해 줘"
  },
  {
    idx: 6,
    text: "아이에게 해주면 좋은말\n6.오늘 하루 가장 즐거운 일은 뭐였니?"
  },
  {
    idx: 7,
    text: "아이에게 해주면 좋은말\n7.하루에 한 번 하늘을 보렴"
  },
  {
    idx: 8,
    text: "아이에게 해주면 좋은말\n8.고맙습니다! 미안합니다!"
  }
];
const continousExerciseDays = null;
const bmiPer = null;
export default (
  state = {
    exerciseGoalCd,
    exerciseDay,
    exerciseRange,
    wiseSaying,
    exerciseInfo
  },
  action
) => {
  switch (action.type) {
    case types.SET_EXERCISE_RANGE:
      return {
        ...state,
        exerciseRange: action.payload
      };
    default:
      return state;
  }
};
