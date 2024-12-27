import { DeleteOutlined } from "@ant-design/icons";
import { Form, Input, Button, Typography, Switch, message } from "antd";
import { addSurvey } from "../../Utils/appwriter";

const AddForm = () => {
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		try {
			// Подготовка данных для отправки
			const surveyData = {
				survey: values.name, // Название опроса
				questions: [JSON.stringify(values.questions)],
				descr: values.descr,
			};

			await addSurvey(surveyData);
			form.resetFields();
			message.success("Форма успешно создана");
		} catch (error) {
			console.error("Ошибка при добавлении опроса:", error);
			message.error("Произошла ошибка");
		}
	};

	return (
		<div>
			<Typography.Title level={3}>Создать опрос</Typography.Title>
			<Form onFinish={onFinish} form={form} layout="vertical">
				<Form.Item
					rules={[{ required: true, message: "Обязательное поле!" }]}
					name="name"
					label="Название опроса"
				>
					<Input size="large" placeholder="Название опроса"></Input>
				</Form.Item>
				<Form.Item
					rules={[{ required: true, message: "Обязательное поле!" }]}
					name="descr"
					label="Описание"
				>
					<Input size="large" placeholder="Описание"></Input>
				</Form.Item>
				<Form.List
					name="questions"
					initialValue={[
						{
							question: "",
							options: [{ option: "", correct: false }],
						},
					]}
					rules={[
						{
							validator: async (_, questions) => {
								if (!questions || questions.length < 1) {
									return Promise.reject(
										new Error(
											"Необходимо добавить хотя бы один вопрос"
										)
									);
								}
							},
						},
					]}
				>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<div
									key={key}
									style={{
										display: "flex",
										marginBottom: 16,
										flexDirection: "column",
									}}
								>
									{/* Вопрос */}
									<Form.Item
										{...restField}
										name={[name, "question"]}
										label={`Вопрос №${name + 1}`}
										rules={[
											{
												required: true,
												message: "Введите вопрос",
											},
										]}
									>
										<Input
											size="large"
											placeholder="Введите текст вопроса"
										/>
									</Form.Item>

									{/* Варианты ответов */}
									<Form.List
										name={[name, "options"]}
										initialValue={[
											{ option: "", correct: false },
										]}
										rules={[
											{
												validator: async (
													_,
													options
												) => {
													if (
														!options ||
														options.length < 1
													) {
														return Promise.reject(
															new Error(
																"Добавьте хотя бы один вариант ответа"
															)
														);
													}
												},
											},
										]}
									>
										{(
											optionFields,
											{
												add: addOption,
												remove: removeOption,
											}
										) => (
											<>
												{optionFields.map(
													({
														key: optionKey,
														name: optionName,
														...restOptionField
													}) => (
														<div
															key={optionKey}
															style={{
																display: "flex",
																justifyContent:
																	"space-between",
																alignItems:
																	"center",
																gap: 8,
															}}
														>
															<Form.Item
																{...restOptionField}
																name={[
																	optionName,
																	"option",
																]}
																label={`Вариант ${
																	optionKey +
																	1
																}`}
																rules={[
																	{
																		required:
																			true,
																		message:
																			"Введите вариант ответа",
																	},
																]}
															>
																<Input
																	size="large"
																	placeholder="Введите вариант ответа"
																/>
															</Form.Item>

															{/* Чекбокс для правильного ответа */}
															<Form.Item
																{...restOptionField}
																name={[
																	optionName,
																	"correct",
																]}
																valuePropName="checked"
																label="Правильный ответ"
															>
																<Switch />
															</Form.Item>

															<Button
																onClick={() =>
																	removeOption(
																		optionName
																	)
																}
																icon={
																	<DeleteOutlined />
																}
																size="small"
															>
																Удалить
															</Button>
														</div>
													)
												)}
												<Form.Item>
													<Button
														type="dashed"
														onClick={() =>
															addOption()
														}
														icon={
															<i className="anticon anticon-plus"></i>
														}
														size="large"
													>
														Добавить вариант ответа
													</Button>
												</Form.Item>
											</>
										)}
									</Form.List>

									{/* Удалить вопрос */}
									<Button
										onClick={() => remove(name)}
										icon={<DeleteOutlined />}
									>
										Удалить вопрос
									</Button>
								</div>
							))}
							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									size="large"
									icon={
										<i className="anticon anticon-plus"></i>
									}
								>
									Добавить вопрос
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Form.Item>
					<Button size="large" type="primary" htmlType="submit">
						Отправить
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddForm;
