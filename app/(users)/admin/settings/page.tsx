"use client";

const AdminSettings = () => (
  <div className="space-y-6 max-w-3xl">
    <div>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
        Settings
      </h1>
      <p className="text-muted-foreground mt-1">Platform configuration</p>
    </div>

    <div className="card-soft space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Platform Name
        </label>
        <input className="input-soft" defaultValue="LearnBright" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Support Email
        </label>
        <input className="input-soft" defaultValue="support@learnbright.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Default Assessment Duration
        </label>
        <select className="input-soft">
          <option>5 minutes</option>
          <option>10 minutes</option>
          <option>15 minutes</option>
        </select>
      </div>
      <button className="btn-accent">Save Changes</button>
    </div>
  </div>
);

export default AdminSettings;
