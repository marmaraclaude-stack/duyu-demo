-- Demo yazma politikaları: satış sunumu ortamında istemci (anon) tarafından
-- CRUD açık tutulur. Gerçek kullanıcı girişi eklendiğinde bu politikalar
-- rollere göre daraltılmalıdır. app_users kasıtlı olarak salt okunur bırakıldı.

create policy "demo write leads" on leads
  for insert to anon, authenticated with check (true);
create policy "demo update leads" on leads
  for update to anon, authenticated using (true) with check (true);
create policy "demo delete leads" on leads
  for delete to anon, authenticated using (true);

create policy "demo write calls" on calls
  for insert to anon, authenticated with check (true);
create policy "demo update calls" on calls
  for update to anon, authenticated using (true) with check (true);
create policy "demo delete calls" on calls
  for delete to anon, authenticated using (true);

create policy "demo write reminders" on reminders
  for insert to anon, authenticated with check (true);
create policy "demo update reminders" on reminders
  for update to anon, authenticated using (true) with check (true);
create policy "demo delete reminders" on reminders
  for delete to anon, authenticated using (true);

create policy "demo write payment_plans" on payment_plans
  for insert to anon, authenticated with check (true);
create policy "demo update payment_plans" on payment_plans
  for update to anon, authenticated using (true) with check (true);

create policy "demo write print_logs" on print_logs
  for insert to anon, authenticated with check (true);

create policy "demo write audit_logs" on audit_logs
  for insert to anon, authenticated with check (true);
