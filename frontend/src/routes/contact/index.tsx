import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { BackToLineLoopLink } from "@/features/accounts/components/BackToLineLoopLink";
import styles from "./styles.module.css";

const CONTACT_EMAIL = "lineloopcontact@gmail.com";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export const ContactPage = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.subject.trim().length > 0 &&
      form.message.trim().length > 0
    );
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    const mailSubject = `[LineLoop Contact] ${form.subject.trim()}`;
    const mailBody = [
      `お名前: ${form.name.trim()}`,
      `メールアドレス: ${form.email.trim()}`,
      "",
      "お問い合わせ内容:",
      form.message.trim(),
    ].join("\n");

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;

    window.location.href = href;
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <BackToLineLoopLink />

      <div className={styles.markdown}>
        <h1>お問い合わせ</h1>
        <p className={styles.lead}>
          LineLoop に関するお問い合わせは、以下のフォームからご連絡ください。
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              お名前
            </label>
            <input
              id="name"
              className={styles.input}
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              autoComplete="name"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="subject" className={styles.label}>
              件名
            </label>
            <input
              id="subject"
              className={styles.input}
              type="text"
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              内容
            </label>
            <textarea
              id="message"
              className={styles.textarea}
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={8}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isValid}
          >
            送信する
          </button>
        </form>

        <p className={styles.note}>
          送信ボタンを押すと、お使いのメールアプリが起動します。
        </p>

        {submitted ? (
          <p className={styles.successMessage}>
            メール作成画面が開かない場合は、メールアプリの設定をご確認ください。
          </p>
        ) : null}
      </div>
    </div>
  );
};