import {
  ChangeEvent,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
  ReactNode,
} from "react";

interface Param {
  id: number;
  name: string;
  type: "string";
}
interface ParamValue {
  paramId: number;
  value: string;
}
interface Model {
  paramValues: ParamValue[];
  // colors: Color[];
}

const params: Param[] = [
  {
    id: 1,
    name: "Назначение",
    type: "string",
  },
  {
    id: 2,
    name: "Длина",
    type: "string",
  },
];
const modelData: Model = {
  paramValues: [
    {
      paramId: 1,
      value: "повседневное",
    },
    {
      paramId: 2,
      value: "макси",
    },
  ],
};

interface ModelContextValue {
  model: Model;
  setModel: Dispatch<SetStateAction<Model>>;
}

const ModelContext = createContext<ModelContextValue>({
  model: modelData,
  setModel: () => {},
});

const useModel = () => useContext(ModelContext);

interface PropsItem {
  param: Param;
  value: string;
}

const ParamEditorItem = (props: PropsItem) => {
  const { setModel } = useModel();
  const [isEditing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(props.value);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  };

  const onSave = () => {
    setModel((prevModel) => ({
      ...prevModel,
      paramValues: prevModel.paramValues.map((item) =>
        item.paramId === props.param.id ? { ...item, value: localValue } : item
      ),
    }));
    setEditing(false);
  };
  const onCancel = () => {
    setLocalValue(props.value);
    setEditing(false);
  };

  return (
    <li>
      <div>{props.value}</div>
      {!isEditing && (
        <button onClick={() => setEditing(true)}>редактировать</button>
      )}
      {isEditing && (
        // Если props.param.type === 'string'
        <div>
          <label>
            {props.param.name}
            <input type="text" value={localValue} onChange={onChange} />
          </label>
          <button onClick={onSave}>Сохранить</button>
          <button onClick={onCancel}>Отменить</button>
        </div>
        // Если props.param.type === 'number'
        // Другой компонент для редактирования чисел
      )}
    </li>
  );
};

interface Props {
  params: Param[];
  model: Model;
}

const ParamEditor = (props: Props) => {
  return (
    <ul>
      {props.model.paramValues.map((item) => (
        <ParamEditorItem
          key={item.paramId}
          value={item.value}
          param={props.params.find((el) => el.id === item.paramId) as Param}
        />
      ))}
    </ul>
  );
};

interface PropsProvider {
  children: ReactNode;
}

const ParamsPage = () => {
  const { model } = useModel();

  return <ParamEditor model={model} params={params} />;
};

export const ModelProvider = (props: PropsProvider) => {
  const [model, setModel] = useState(modelData);

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {props.children}
    </ModelContext.Provider>
  );
};

function App() {
  return (
    <div>
      <ModelProvider>
        <ParamsPage />
      </ModelProvider>
    </div>
  );
}

export default App;
